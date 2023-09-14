// pieceLogic.tsx
import {
  BoardLayout_Turn_Movesplayed_Type,
  BoardLayout_Turn_Movesplayed_Row_Col_Type,
  BoardLayout_Turn_Row_Col_Type,
  BoardLayout_Turn_Row_Col_PieceType_Type,
} from "../types";
import { pieceMovement } from "../types";

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

const rookBishopQueen = (props: BoardLayout_Turn_Row_Col_PieceType_Type): { type: string; row: number; col: number }[] => {
  const { BoardLayout, turn, row, col, pieceType } = props;
  const possibleMoves: { type: string; row: number; col: number }[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (const { row: moveI, col: moveJ } of moves) {
    let currentRow = row + moveI;
    let currentCol = col + moveJ;

    while (true) {
      const res = pieceOnLoc({ BoardLayout, turn, row: currentRow, col: currentCol });

      if (res === "empty square" || res === "opponent piece") {
        possibleMoves.push({ type: "normal", row: currentRow, col: currentCol });
      }

      if (res !== "empty square") break;

      currentRow += moveI;
      currentCol += moveJ;
    }
  }

  return possibleMoves;
};

const knightKing = (props: BoardLayout_Turn_Row_Col_PieceType_Type): { type: string; row: number; col: number }[] => {
  const { BoardLayout, turn, pieceType, row, col } = props;
  let possibleMoves: { type: string; row: number; col: number }[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (let i = 0; i < moves.length; i++) {
    const newRow: number = row + moves[i].row;
    const newCol: number = col + moves[i].col;
    const res = pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol });
    if (res === "empty square" || res === "opponent piece") possibleMoves.push({ type: "normal", row: newRow, col: newCol });
  }

  return possibleMoves;
};
const pawn = (props: BoardLayout_Turn_Row_Col_PieceType_Type): { type: string; row: number; col: number }[] => {
  const { BoardLayout, turn, row, col } = props;
  let possibleMoves: { type: string; row: number; col: number }[] = [];
  const forward = turn === "white" ? -1 : 1;

  // Check one square forward
  let newRow = row + forward;
  let newCol = col;
  if (pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol }) === "empty square") {
    possibleMoves.push({ type: "normal", row: newRow, col: newCol });

    // Check two squares forward if on starting position
    newRow = row + 2 * forward;
    if ((turn === "white" && row === 6) || (turn === "black" && row === 1)) {
      if (pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol }) === "empty square") {
        possibleMoves.push({ type: "normal", row: newRow, col: newCol });
      }
    }
  }

  // Check diagonal captures
  const diagonalMoves = [
    { row: forward, col: -1 },
    { row: forward, col: 1 },
  ];
  for (const move of diagonalMoves) {
    newRow = row + move.row;
    newCol = col + move.col;
    const res = pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol });
    if (res === "opponent piece") {
      possibleMoves.push({ type: "normal", row: newRow, col: newCol });
    }
  }

  return possibleMoves;
};

const pieceFunctions: { [key: string]: (props: BoardLayout_Turn_Row_Col_PieceType_Type) => { type: string; row: number; col: number }[] } = {
  rook: rookBishopQueen,
  bishop: rookBishopQueen,
  queen: rookBishopQueen,
  knight: knightKing,
  king: knightKing,
  pawn: pawn,
};

const findMoves = (props: BoardLayout_Turn_Movesplayed_Row_Col_Type): { type: string; row: number; col: number }[] => {
  const { BoardLayout, turn, row, col } = props;
  let ans: { type: string; row: number; col: number }[] = [];
  const square: { type: string; piece: string } = BoardLayout[row][col];

  if (square.type === turn && "" !== square.piece) {
    if (pieceFunctions.hasOwnProperty(square.piece)) {
      ans = [...pieceFunctions[square.piece]({ BoardLayout, turn, pieceType: square.piece, row, col })];
    }
  }
  return ans;
};

export const allMoves = (props: BoardLayout_Turn_Movesplayed_Type): { type: string; row: number; col: number }[][][] => {
  const validMoves: { type: string; row: number; col: number }[][][] = [];

  for (let row = 0; row < 8; row++) {
    const validMovesrow: { type: string; row: number; col: number }[][] = [];
    for (let col = 0; col < 8; col++) {
      validMovesrow.push(findMoves({ ...props, row, col }));
    }
    validMoves.push(validMovesrow);
  }
  return validMoves;
};

export const kingInCheck = (props: BoardLayout_Turn_Movesplayed_Type) => {
  const { BoardLayout, turn } = props;
  const opponentMoves = allMoves(props);
  for (let row: number = 0; row < 8; row++) {
    for (let col: number = 0; col < 8; col++) {
      for (let i: number = 0; i < opponentMoves[row][col].length; i++) {
        const { row: curRow, col: curCol } = opponentMoves[row][col][i];
        if (BoardLayout[curRow][curCol].type !== turn && BoardLayout[curRow][curCol].piece === "king") {
          return true;
        }
      }
    }
  }
  return false;
};
