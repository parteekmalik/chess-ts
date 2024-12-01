import type { IPuzzleContextState } from "~/app/puzzle/_components/PuzzleContext";

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