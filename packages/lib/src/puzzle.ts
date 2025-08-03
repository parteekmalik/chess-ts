export interface Puzzle {
  moves: string[];
  fen: string;
  openingTags: string[];
  themes: string[];
  rating: number;
  ratingDeviation: number;
}
