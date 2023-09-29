import { emptyPiece, boardData_Type } from "../../types";

export const movePiece = (boardData: boardData_Type): boardData_Type => {
  const move = boardData.movesPlayed.moves[boardData.movesPlayed.moves.length - 1];
  const { BoardLayout: boardLayout } = boardData;

  boardLayout[move.to.row][move.to.col] = boardLayout[move.from.row][move.from.col];
  boardLayout[move.from.row][move.from.col] = emptyPiece;

  if (move.type === "pawn en passent") boardLayout[move.from.row][move.to.col] = emptyPiece;
  else if (move.castle) {
    boardLayout[move.castle.to.row][move.castle.to.col] = boardLayout[move.castle.from.row][move.castle.from.col];
    boardLayout[move.castle.from.row][move.castle.from.col] = emptyPiece;
  }
  return boardData;
};
