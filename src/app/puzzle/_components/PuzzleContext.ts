"use client";
import { Chess, Color } from "chess.js";
import { createContext } from "react";
import { IPuzzleContextActions } from "./PuzzleReducer";
import { ChessMoveType } from "~/modules/board/boardMain";

export type Puzzle = {
  moves: string[];
  fen: string;
  openingTags: string[];
  themes: string[];
  rating: number;
  ratingDeviation: number;
};

export interface IPuzzleContextState {
  puzzleList: Puzzle[];
  passedPuzzleList: boolean[];
  puzzleNo: number;
  livesLeft: number;
  playerTurn: Color;
  movesPlayed: ChessMoveType[];
}
export const defaultPuzzleContextState: IPuzzleContextState = {
  puzzleList: [],
  passedPuzzleList: [],
  puzzleNo: 0,
  movesPlayed: [],
  livesLeft: 3,
  playerTurn: "w",
};

export interface IPuzzleContextProps {
  PuzzleState: IPuzzleContextState;
  PuzzleDispatch: React.Dispatch<IPuzzleContextActions>;
}

const PuzzleContext = createContext<IPuzzleContextProps>({
  PuzzleState: defaultPuzzleContextState,
  PuzzleDispatch: () => {},
});

export const PageContextConsumer = PuzzleContext.Consumer;
export const PuzzleContextProvider = PuzzleContext.Provider;

export default PuzzleContext;
