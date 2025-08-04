import { TRPCError } from "@trpc/server";
import axios from "axios";
import moment from "moment";
import { z } from "zod";

import { findMatch, findMatchSchema, makeMove, MoveSchema } from "@acme/lib";

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
  findMatch: publicProcedure.input(findMatchSchema).mutation(async ({ ctx, input }) => {
    try {
      const match = await findMatch({ db: ctx.db, input, userId: ctx.session?.user.id });
      if (match)
        await axios
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
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as Error).message,
      });
    }
  }),
  makeMove: protectedProcedure.input(z.object({ move: MoveSchema, matchId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    try {
      const match = await makeMove(ctx.db, { userId: ctx.session.user.id, matchId: input.matchId, move: input.move });
      await axios.post(
        `${env.BACKEND_WS}/emit_update`,
        { matchId: input.matchId, match },
        {
          headers: {
            "x-auth-secret": env.AUTH_SECRET,
          },
        },
      );
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as Error).message,
      });
    }
    return "sucess";
  }),
});
