import puzzles from "../utils/puzzles.json";

import { createTRPCRouter, publicProcedure } from "../trpc";
import type { Puzzle } from "@acme/lib";

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
});
