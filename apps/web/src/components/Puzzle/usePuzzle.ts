import { useEffect, useReducer } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { defaultPuzzleContextState, PuzzleReducer } from "./PuzzleReducer";

function usePuzzle() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: puzzleList = [] } = useQuery(trpc.puzzle.getPuzzles.queryOptions());

  const [PuzzleState, PuzzleDispatch] = useReducer(PuzzleReducer, defaultPuzzleContextState);

  useEffect(() => {
    if (puzzleList.length > 0 && (PuzzleState.livesLeft === 0 || PuzzleState.puzzleList.length === 0)) {
      PuzzleDispatch({ type: "update_puzzle_list", payload: puzzleList });
    }
  }, [puzzleList, PuzzleState.livesLeft]);

  const reset = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.puzzle.getPuzzles.queryKey(),
    });
  };

  return { puzzleList, PuzzleState, PuzzleDispatch, reset };
}

export default usePuzzle;
