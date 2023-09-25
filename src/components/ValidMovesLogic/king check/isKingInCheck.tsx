import { boardData_Type } from "../../types";
import { isValidMove, rookBishopQueen, knightKing } from "../pieceLogic";
import findKingPos from "./findKingPos";

export const iskingInCheck = (boardData: boardData_Type): boolean => {
  const { BoardLayout, turn } = boardData;
  const kingPos: { row: number; col: number } = findKingPos(boardData);
  // console.log("kingPos -> ",kingPos);

  let moves = rookBishopQueen(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "rook" });
  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].row][moves[i].col].piece === "queen" || BoardLayout[moves[i].row][moves[i].col].piece === "rook") return true;

  moves = rookBishopQueen(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "bishop" });

  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].row][moves[i].col].piece === "queen" || BoardLayout[moves[i].row][moves[i].col].piece === "bishop") return true;

  moves = knightKing(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "knight" });
  for (let i = 0; i < moves.length; i++) if (BoardLayout[moves[i].row][moves[i].col].piece === "knight") return true;

  // refacto code using pieceonloc function
  if (turn === "white") {
    const leftpawn = isValidMove(kingPos.row - 1, kingPos.col - 1) ? BoardLayout[kingPos.row - 1][kingPos.col - 1] : { type: "", piece: "" };
    const rightpawn = isValidMove(kingPos.row - 1, kingPos.col + 1) ? BoardLayout[kingPos.row - 1][kingPos.col + 1] : { type: "", piece: "" };
    if ((leftpawn.piece === "pawn" && leftpawn.type !== turn) || (rightpawn.piece === "pawn" && rightpawn.type !== turn)) return true;
  } else { 
    
    const leftpawn = isValidMove(kingPos.row + 1, kingPos.col - 1) ? BoardLayout[kingPos.row + 1][kingPos.col - 1] : { type: "", piece: "" };
    const rightpawn = isValidMove(kingPos.row + 1, kingPos.col + 1) ? BoardLayout[kingPos.row + 1][kingPos.col + 1] : { type: "", piece: "" };
    if ((leftpawn.piece === "pawn" && leftpawn.type !== turn) || (rightpawn.piece === "pawn" && rightpawn.type !== turn)) return true;
  }
  return false;
};
