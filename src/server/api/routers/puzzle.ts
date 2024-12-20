import puzzles from "../../../../public/puzzles.json";

import type { Puzzle } from "~/app/puzzle/_components/PuzzleContext";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const puzzleList = puzzles as Record<number, Puzzle>;

export const puzzleRouter = createTRPCRouter({
  getPuzzles: publicProcedure.query(async () => {
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
