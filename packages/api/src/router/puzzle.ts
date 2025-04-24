import { z } from "zod";

import type { Puzzle } from "@acme/lib";
import { calculateTimeLeft } from "@acme/lib";

import { createTRPCRouter, publicProcedure } from "../trpc";
import puzzles from "../utils/puzzles.json";

const puzzleList = puzzles as Record<number, Puzzle>;

export const puzzleRouter = createTRPCRouter({
  getPuzzles: publicProcedure.query(() => {
    const allPuzzleKeys = Object.keys(puzzleList);
    const selectedPuzzles: Puzzle[] = [];

    // Select every 40th puzzle randomly
    for (let i = 0; i < allPuzzleKeys.length; i += 40) {
      const randomIndex = Math.floor(Math.random() * 40) + i;
      const key = allPuzzleKeys[Math.min(randomIndex, allPuzzleKeys.length - 1)];
      selectedPuzzles.push(puzzleList[Number(key)]!);
    }

    return selectedPuzzles;
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
});
