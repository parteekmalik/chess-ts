import { boardData_Type } from "../../types";
import { rookBishopQueen, knightKing, pieceOnLoc } from "../logic/pieceLogic";
import findKingPos from "./findKingPos";

export const iskingInCheck = (boardData: boardData_Type): boolean => {
  const { turn } = boardData;
  const kingPos: { row: number; col: number } = findKingPos(boardData);

  let moves = rookBishopQueen(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "R" });
  for (let i = 0; i < moves.length; i++) {
    const res = pieceOnLoc(boardData, { row: moves[i].row, col: moves[i].col });
    if (["OQ", "OR"].includes(res)) return true;
  }

  moves = rookBishopQueen(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "B" });
  for (let i = 0; i < moves.length; i++) {
    const res = pieceOnLoc(boardData, { row: moves[i].row, col: moves[i].col });
    if (["OQ", "OB"].includes(res)) return true;
  }

  moves = knightKing(boardData, { row: kingPos.row, col: kingPos.col, pieceType: "N" });
  for (let i = 0; i < moves.length; i++) {
    const res = pieceOnLoc(boardData, { row: moves[i].row, col: moves[i].col });
    if (["ON"].includes(res)) return true;
  }

  const pawnRow = (turn === "w" ? -1 : 1) + kingPos.row;
  const leftpawn = pieceOnLoc(boardData, { row: pawnRow, col: kingPos.col - 1 });
  const rightpawn = pieceOnLoc(boardData, { row: pawnRow, col: kingPos.col + 1 });

  if (leftpawn === "OP" || rightpawn === "OP") return true;

  return false;
};
