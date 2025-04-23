import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { defaultPuzzleContextState, PuzzleReducer } from "./PuzzleReducer";

function usePuzzle() {
  const trpc = useTRPC();
  const { data: puzzleList = [] } = useQuery(trpc.puzzle.getPuzzles.queryOptions());

  const [PuzzleState, PuzzleDispatch] = useReducer(PuzzleReducer, defaultPuzzleContextState);

  useEffect(() => {
    if (puzzleList.length > 0 && PuzzleState.puzzleList.length === 0) {
      PuzzleDispatch({ type: "update_puzzle_list", payload: puzzleList });
    }
  });
  return { puzzleList, PuzzleState, PuzzleDispatch };
}

export default usePuzzle;
