// pieceLogic.tsx
import { MovesPlayed_Type } from "../types";
import { movesplayed_Type } from "../types";
import { Turn_Type } from "../types";
import {
  BoardLayout_Turn_Movesplayed_Type,
  BoardLayout_Turn_Movesplayed_Row_Col_Type,
  BoardLayout_Turn_Row_Col_Type,
  BoardLayout_Turn_Row_Col_PieceType_Type,
  BoardLayout_Turn_Row_Col_PieceType_Movesplayed_Type,
  moves_Type,
} from "../types";
import { pieceMovement } from "../types";
import { pawn, knightKingcastle } from "./specialmovelogic";

export const isValidMove = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};
export const pieceOnLoc = (props: BoardLayout_Turn_Row_Col_Type): string => {
  const { BoardLayout, turn, row, col } = props;
  if (!isValidMove(row, col)) return "invalid Pos";
  const square = BoardLayout[row][col].type;
  if (square === "empty") return "empty square";
  return square === turn ? "friendly piece" : "opponent piece";
};

export const rookBishopQueen = (props: BoardLayout_Turn_Row_Col_PieceType_Type): moves_Type[] => {
  const { BoardLayout, turn, row, col, pieceType } = props;
  const possibleMoves: moves_Type[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (const { row: moveI, col: moveJ } of moves) {
    let currentRow = row + moveI;
    let currentCol = col + moveJ;

    while (true) {
      const res = pieceOnLoc({ BoardLayout, turn, row: currentRow, col: currentCol });

      if (res === "empty square" || res === "opponent piece") {
        possibleMoves.push({
          type: pieceType + res === "empty square" ? " normal" : " capture",
          hint: { row: currentRow, col: currentCol },
          toBeMoved: [{ row: currentRow, col: currentCol }],
        });
      }

      if (res !== "empty square") break;

      currentRow += moveI;
      currentCol += moveJ;
    }
  }

  return possibleMoves;
};

export const knightKing = (props: BoardLayout_Turn_Row_Col_PieceType_Type): moves_Type[] => {
  const { BoardLayout, turn, pieceType, row, col } = props;
  let possibleMoves: moves_Type[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (let i = 0; i < moves.length; i++) {
    const newRow: number = row + moves[i].row;
    const newCol: number = col + moves[i].col;
    const res = pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol });
    if (res === "empty square" || res === "opponent piece")
      possibleMoves.push({
        type: pieceType + res === "empty square" ? "normal" : "capture",
        hint: { row: newRow, col: newCol },
        toBeMoved: [{ row: newRow, col: newCol }],
      });
  }

  return possibleMoves;
};

const normalpieceFunctions: { [key: string]: (props: BoardLayout_Turn_Row_Col_PieceType_Type) => moves_Type[] } = {
  rook: rookBishopQueen,
  bishop: rookBishopQueen,
  queen: rookBishopQueen,
  knight: knightKing,
};

const specialpieceFunctions: { [key: string]: (props: BoardLayout_Turn_Row_Col_PieceType_Movesplayed_Type) => moves_Type[] } = {
  king: knightKingcastle,
  pawn: pawn,
};

const findMoves = (props: BoardLayout_Turn_Movesplayed_Row_Col_Type): moves_Type[] => {
  const { BoardLayout, turn, row, col, movesPlayed } = props;
  let ans: moves_Type[] = [];
  const square: { type: string; piece: string } = BoardLayout[row][col];

  if (square.type === turn && "" !== square.piece) {
    if (square.piece === "king" || square.piece === "pawn")
      ans = [...specialpieceFunctions[square.piece]({ BoardLayout, turn, pieceType: square.piece, row, col, movesPlayed })];
    else ans = [...normalpieceFunctions[square.piece]({ BoardLayout, turn, pieceType: square.piece, row, col })];
  }
  return ans;
};

export const allMoves = (props: BoardLayout_Turn_Movesplayed_Type): moves_Type[][][] => {
  const validMoves: moves_Type[][][] = [];

  for (let row = 0; row < 8; row++) {
    const validMovesrow: moves_Type[][] = [];
    for (let col = 0; col < 8; col++) {
      validMovesrow.push(findMoves({ ...props, row, col }));
    }
    validMoves.push(validMovesrow);
  }
  return validMoves;
};
