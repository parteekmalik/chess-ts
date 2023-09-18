import { BoardLayout_Turn_Movesplayed_Type } from "../../types";
import { isValidMove, rookBishopQueen, knightKing } from "../pieceLogic";
import findKingPos from "./findKingPos";

export const iskingInCheck = (props: BoardLayout_Turn_Movesplayed_Type): boolean => {
  const { BoardLayout, turn } = props;
  const kingPos: { row: number; col: number } = findKingPos({ BoardLayout, turn });

  let moves = rookBishopQueen({ BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "rook" });
  console.log("rook moves to check in king", moves);
  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].row][moves[i].col].piece === "queen" || BoardLayout[moves[i].row][moves[i].col].piece === "rook") return true;

  moves = rookBishopQueen({ BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "bishop" });
  console.log("bishop moves to check in king", moves);

  for (let i = 0; i < moves.length; i++)
    if (BoardLayout[moves[i].row][moves[i].col].piece === "queen" || BoardLayout[moves[i].row][moves[i].col].piece === "bishop") return true;

  moves = knightKing({ BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "knight" });
  console.log("knight moves to check in king", moves);
  for (let i = 0; i < moves.length; i++) if (BoardLayout[moves[i].row][moves[i].col].piece === "knight") return true;

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
