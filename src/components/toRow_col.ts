import { SQUARES, Square } from "chess.js";

export const toRowCol = (square: Square): number[] => {
  const rowIndex = Math.floor(SQUARES.indexOf(square) / 8);
  const colIndex = SQUARES.indexOf(square) % 8;
  return [rowIndex, colIndex];
};
