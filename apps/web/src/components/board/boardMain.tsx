import type { ChessMoveType } from "@acme/lib";

import type { IPuzzleContextState } from "~/components/Puzzle/PuzzleReducer";

export interface BoardProps {
  State: IPuzzleContextState;
  playedMove: (move: ChessMoveType) => void;
}
