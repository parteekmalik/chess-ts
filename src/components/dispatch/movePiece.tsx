import { boardData_Type, moves_Type, emptyPiece } from "../types";

export const movePiece = (boardData: boardData_Type, Move: moves_Type, prev: { row: number; col: number }): boardData_Type => {
  Move.toBeMoved.forEach((current) => {
    boardData.BoardLayout[current.row][current.col] = { ...boardData.BoardLayout[prev.row][prev.col] };
    boardData.BoardLayout[prev.row][prev.col] = { ...emptyPiece };
    prev = current;
  });
  return boardData;
};
