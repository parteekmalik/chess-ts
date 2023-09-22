import { BoardLayout_Turn_Movesplayed_Type, boardData_Type } from "../../types";
import { isValidMove, rookBishopQueen, knightKing } from "../pieceLogic";
import findKingPos from "./findKingPos";

export const iskingInCheck = (boardData:boardData_Type): boolean => {
  const { BoardLayout, turn } = boardData;
  const kingPos: { row: number; col: number } = findKingPos({ BoardLayout, turn });

  let moves = rookBishopQueen(boardData, {row: kingPos.row, col: kingPos.col, pieceType: "rook" });
  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].hint.row][moves[i].hint.col].piece === "queen" || BoardLayout[moves[i].hint.row][moves[i].hint.col].piece === "rook") return true;

  moves = rookBishopQueen(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "bishop" });

  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].hint.row][moves[i].hint.col].piece === "queen" || BoardLayout[moves[i].hint.row][moves[i].hint.col].piece === "bishop") return true;

  moves = knightKing(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "knight" });
  for (let i = 0; i < moves.length; i++) if (BoardLayout[moves[i].hint.row][moves[i].hint.col].piece === "knight") return true;

  // refacto code using pieceonloc function
  if (turn === "white") {
    const leftpawn = BoardLayout[kingPos.row - 1][kingPos.col - 1];
    const rightpawn = BoardLayout[kingPos.row - 1][kingPos.col + 1];
    if (
      (isValidMove(kingPos.row - 1, kingPos.col - 1) && leftpawn.piece === "pawn" && leftpawn.type !== turn) ||
      (isValidMove(kingPos.row - 1, kingPos.col + 1) && rightpawn.piece === "pawn" && rightpawn.type !== turn)
    )
      return true;
  } else {
    const leftpawn = BoardLayout[kingPos.row + 1][kingPos.col - 1];
    const rightpawn = BoardLayout[kingPos.row + 1][kingPos.col + 1];
    if (
      (isValidMove(kingPos.row + 1, kingPos.col - 1) && leftpawn.piece === "pawn" && leftpawn.type !== turn) ||
      (isValidMove(kingPos.row + 1, kingPos.col + 1) && rightpawn.piece === "pawn" && rightpawn.type !== turn)
    )
      return true;
  }
  return false;
};

