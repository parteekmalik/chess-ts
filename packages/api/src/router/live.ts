import type { Prisma } from "@acme/db";
import { calculateTimeLeft, MoveSchema } from "@acme/lib";
import { Chess } from "chess.js";
import moment from "moment";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const liveGameRouter = createTRPCRouter({
  getUser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getMatch: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.match.findUnique({
      where: {
        id: input,
      },
      include: {
        moves: true,
        stats: true,
      },
    });
    if (data) {
      const timeData = calculateTimeLeft(
        { baseTime: data.baseTime, incrementTime: data.incrementTime },
        [data.startedAt].concat(data.moves.map((i) => i.timestamps)),
      );
      if (timeData.w < 0) {
        void ctx.db.matchResult.update({
          where: { id: data.stats!.id },
          data: {
            winner: "BLACK",
            reason: "time",
          },
        });
        return { ...data, stats: { ...data.stats, winner: "BLACK", reason: "time" } };
      }
      if (timeData.b < 0) {
        void ctx.db.matchResult.update({
          where: { id: data.stats!.id },
          data: {
            winner: "WHITE",
            reason: "time",
          },
        });
        return { ...data, stats: { ...data.stats, winner: "WHITE", reason: "time" } };
      }
    }
    return data;
  }),
  makeMove: protectedProcedure.input(z.object({ move: MoveSchema, matchId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const match = await ctx.db.match.findUnique({
      where: {
        id: input.matchId,
      },
      include: {
        moves: true,
        stats: true,
      },
    });
    if (!match) throw new TRPCError({ message: "Match not found", code: "NOT_FOUND" });

    const game = new Chess();
    match.moves.forEach((move) => game.move(move.move));
    
    if ((game.turn() === "w" ? match.whitePlayerId : match.blackPlayerId) === ctx.session.user.id) {
      throw new TRPCError({
        message: "You cannot make a move on your opponent's turn",
        code: "FORBIDDEN",
      });
    }
    try {
      game.move(input.move);
    } catch {
      throw new TRPCError({message: "Invalid move", code: "BAD_REQUEST" });
    }
    const move = game.history().slice(-1)[0]!;

    match.moves.push({
      matchId: input.matchId,
      move,
      timestamps: moment().toDate(),
      id: "",
    });

    if (game.isGameOver()) {
      const data = {
        winner: game.isDraw() ? "DRAW" : game.turn() === "w" ? "BLACK" : "WHITE",
        reason: game.isDraw() ? "repetition" : "checkmate",
      } satisfies Prisma.MatchResultUpdateArgs["data"];
      const result = await ctx.db.matchResult
        .update({
          where: {
            matchId: input.matchId,
          },
          data: {
            winner: data.winner,
            reason: data.reason,
          },
        })
      match.stats = result;
    }

    await ctx.db.move.create({
      data: {
        move,
        matchId: input.matchId,
      },
    });
  }),
});
