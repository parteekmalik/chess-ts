import { ChessMoveType } from "@acme/lib";
import type { IPuzzleContextState } from "~/app/play/puzzle/_components/PuzzleReducer";
export interface BoardProps {
  State: IPuzzleContextState;
  playedMove: (move: ChessMoveType) => void;
}
