import { useEffect } from "react";
import { BoardLayout_Turn_Movesplayed_Type,BoardLayout_Turn_Row_Col_Type, BoardLayout_Turn_Row_Col_PieceType_Type } from "../../types";
import { allMoves } from "../pieceLogic";
import findKingPos from "./findKingPos";

import { pieceMovement } from "../../types";

const isValidMove = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};
const pieceOnLoc = (props: BoardLayout_Turn_Row_Col_Type): string => {
  const { BoardLayout, turn, row, col } = props;
  if (!isValidMove(row, col)) return "invalid Pos";
  const square = BoardLayout[row][col].type;
  if (square === "empty") return "empty square";
  return square === turn ? "friendly piece" : "opponent piece";
};

const rookBishopQueen = (props: BoardLayout_Turn_Row_Col_PieceType_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] => {
  const { BoardLayout, turn, row, col, pieceType } = props;
  const possibleMoves: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (const { row: moveI, col: moveJ } of moves) {
    let currentRow = row + moveI;
    let currentCol = col + moveJ;

    while (true) {
      const res = pieceOnLoc({ BoardLayout, turn, row: currentRow, col: currentCol });

      if (res === "empty square" || res === "opponent piece") {
        possibleMoves.push({ type: "normal", row: currentRow, col: currentCol, toBeMoved: [{ row: currentRow, col: currentCol }] });
      }

      if (res !== "empty square") break;

      currentRow += moveI;
      currentCol += moveJ;
    }
  }

  return possibleMoves;
};
const knightKing = (props: BoardLayout_Turn_Row_Col_PieceType_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] => {
  const { BoardLayout, turn, pieceType, row, col } = props;
  let possibleMoves: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (let i = 0; i < moves.length; i++) {
    const newRow: number = row + moves[i].row;
    const newCol: number = col + moves[i].col;
    const res = pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol });
    if (res === "empty square" || res === "opponent piece") possibleMoves.push({ type: "normal", row: newRow, col: newCol, toBeMoved: [{ row: newRow, col: newCol }] });
  }

  return possibleMoves;
};

export const iskingInCheck = (props: BoardLayout_Turn_Movesplayed_Type): boolean => {
  const { BoardLayout, turn } = props;
  const kingPos: {row:number,col:number} = findKingPos({BoardLayout,turn});
  // console.log(kingPos,turn,BoardLayout);

  let moves = rookBishopQueen({BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "rook"})
  console.log("rook moves to check in king",moves);
  for(let i=0;i<moves.length;i++)if(BoardLayout[moves[i].row][moves[i].col].piece === "queen" ||BoardLayout[moves[i].row][moves[i].col].piece === "rook")return true;

  moves = rookBishopQueen({BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "bishop"})
  console.log("bishop moves to check in king",moves);

  for(let i=0;i<moves.length;i++)if(BoardLayout[moves[i].row][moves[i].col].piece === "queen" ||BoardLayout[moves[i].row][moves[i].col].piece === "bishop")return true;

  moves = knightKing({BoardLayout, turn, row: kingPos.row, col: kingPos.col, pieceType: "knight"})
  console.log("knight moves to check in king",moves);
  for(let i=0;i<moves.length;i++)if(BoardLayout[moves[i].row][moves[i].col].piece === "knight")return true;

  if(turn ==="white") {
    const leftpawn = BoardLayout[kingPos.row-1][kingPos.col-1];
    const rightpawn = BoardLayout[kingPos.row-1][kingPos.col+1];
    if(isValidMove(kingPos.row-1,kingPos.col-1) && leftpawn.piece === "pawn" && leftpawn.type !== turn ||isValidMove(kingPos.row-1,kingPos.col+1) && rightpawn.piece === "pawn" && rightpawn.type !== turn)return true;
  }
  else {
    const leftpawn = BoardLayout[kingPos.row+1][kingPos.col-1];
    const rightpawn = BoardLayout[kingPos.row+1][kingPos.col+1];
    if(isValidMove(kingPos.row+1,kingPos.col-1) && leftpawn.piece === "pawn" && leftpawn.type !== turn || isValidMove(kingPos.row+1,kingPos.col+1) && rightpawn.piece === "pawn" && rightpawn.type !== turn)return true;
  }               
  return false;
};
