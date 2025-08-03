import { TRPCError } from "@trpc/server";
import axios from "axios";
import moment from "moment";
import { z } from "zod";

import { makeMove, MoveSchema } from "@acme/lib";

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
