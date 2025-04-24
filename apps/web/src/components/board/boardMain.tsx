import type { IPuzzleContextState } from "~/app/play/puzzle/_components/PuzzleReducer";

export type ChessMoveType =
  | string
  | {
      from: string;
      to: string;
      promotion?: string;
    };

export interface BoardProps {
  State: IPuzzleContextState;
  playedMove: (move: ChessMoveType) => void;
}
