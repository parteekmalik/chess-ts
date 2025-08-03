import { TRPCError } from "@trpc/server";
import axios from "axios";
import { Chess } from "chess.js";
import moment from "moment";
import { z } from "zod";

import type { MatchWinner } from "@acme/db";
import { MoveSchema } from "@acme/lib";

import { env } from "../env";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
    return data;
  }),
  cancelWaiting: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.watingPlayer.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return true;
  }),
  isWaitingForMatch: protectedProcedure.query(async ({ ctx }) => {
    const slot = await ctx.db.watingPlayer.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      take: 1,
    });
    if (slot) {
      if (moment(slot.expiry).isBefore(moment())) {
        await ctx.db.watingPlayer.delete({
          where: {
            id: slot.id,
          },
        });
        return false;
      }
      return true;
    } else return false;
  }),
  findMatch: publicProcedure
    .input(
      z.object({
        baseTime: z.number().min(1),
        incrementTime: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const toFillSlot = await ctx.db.watingPlayer.findFirst({
        where: {
          NOT: {
            id: ctx.session?.user.id,
          },
        },
      });
      const isWaiting = await ctx.db.watingPlayer.findFirst({ where: { userId: ctx.session?.user.id } });
      if (isWaiting || !ctx.session) return;
      if (toFillSlot) {
        const match = await ctx.db.match.create({
          data: {
            baseTime: input.baseTime,
            incrementTime: input.incrementTime,
            whitePlayerId: toFillSlot.userId,
            blackPlayerId: ctx.session.user.id,
            startedAt: moment().toDate(),
            stats: {
              create: {},
            },
          },
          include: {
            moves: true,
            stats: true,
          },
        });
        await ctx.db.watingPlayer.delete({
          where: {
            id: toFillSlot.id,
          },
        });
        axios
          .post(
            `${env.BACKEND_WS}/emit_match_created`,
            {
              match,
            },
            {
              headers: {
                "x-auth-secret": env.AUTH_SECRET,
              },
            },
          )
          .catch((err) => {
            console.error("Error while sending match request", err);
          });
      } else if (ctx.session.user.id) {
        await ctx.db.watingPlayer.create({
          data: {
            baseTime: input.baseTime,
            incrementTime: input.incrementTime,
            userId: ctx.session.user.id,
            expiry: moment().add(5, "minutes").toDate(),
          },
        });
      }
    }),
  makeMove: protectedProcedure.input(z.object({ move: MoveSchema, matchId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    let match = await ctx.db.match.findUnique({
      where: {
        id: input.matchId,
      },
      include: {
        moves: true,
        stats: true,
      },
    });
    if (!match) throw new TRPCError({ message: "Match not found", code: "NOT_FOUND" });
    if (match.stats?.winner !== "PLAYING") throw new TRPCError({ message: "Math is already over", code: "BAD_REQUEST" });
    const game = new Chess();
    match.moves.forEach((move) => game.move(move.move));

    if ((game.turn() === "w" ? match.whitePlayerId : match.blackPlayerId) !== ctx.session.user.id) {
      throw new TRPCError({
        message: "You cannot make a move on your opponent's turn",
        code: "FORBIDDEN",
      });
    }
    try {
      game.move(input.move);
    } catch {
      throw new TRPCError({ message: "Invalid move", code: "BAD_REQUEST" });
    }
    const move = game.history().slice(-1)[0]!;

    match.moves.push({
      matchId: input.matchId,
      move,
      timestamps: moment().toDate(),
      id: "",
    });

    const winner: MatchWinner = game.isDraw() ? "DRAW" : game.turn() === "w" ? "BLACK" : "WHITE";
    const reason = game.isDraw() ? "repetition" : "checkmate";

    match = await ctx.db.match.update({
      where: {
        id: input.matchId,
      },
      data: {
        moves: {
          create: {
            move,
          },
        },
        stats: game.isGameOver()
          ? {
              upsert: {
                create: { winner, reason },
                update: { winner, reason },
              },
            }
          : undefined,
      },
      include: {
        moves: true,
        stats: true,
      },
    });
    await axios.post(
      `${env.BACKEND_WS}/emit_update`,
      { matchId: input.matchId, match },
      {
        headers: {
          "x-auth-secret": env.AUTH_SECRET,
        },
      },
    );
    return "sucess";
  }),
});
