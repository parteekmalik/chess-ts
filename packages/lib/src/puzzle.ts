export interface Puzzle {
  moves: string[];
  fen: string;
  openingTags: string[];
  themes: string[];
  rating: number;
  ratingDeviation: number;
}

export declare type Color = "w" | "b";
export type ChessMoveType =
  | string
  | {
      from: string;
      to: string;
      promotion?: string;
    };
