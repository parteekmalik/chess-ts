// pieceLogic.tsx
import { moves_Type, boardData_Type, Row_Col_PieceType_Type, Row_Col_Type } from "../types";
import { pieceMovement } from "../types";
import { pawnenpassent, Kingcastle } from "./specialmovelogic";

export const isValidMove = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};
export const pieceOnLoc = (boardData: boardData_Type, props: Row_Col_Type): string => {
  const { row, col } = props;
  const { BoardLayout, turn } = boardData;
  if (!isValidMove(row, col)) return "invalid Pos";
  const square = BoardLayout[row][col].type;
  if (square === "empty") return "empty square";
  return square === turn ? "friendly piece" : "opponent piece";
};

export const rookBishopQueen = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  const { row, col, pieceType } = props;
  const possibleMoves: moves_Type[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (const { row: moveI, col: moveJ } of moves) {
    let currentRow = row + moveI;
    let currentCol = col + moveJ;

    while (true) {
      const res = pieceOnLoc(boardData, { row: currentRow, col: currentCol });

      if (res === "empty square" || res === "opponent piece") {
        possibleMoves.push({
          type: pieceType + res === "empty square" ? "normal" : "capture",
          row: currentRow,
          col: currentCol,
        });
      }

      if (res !== "empty square") break;

      currentRow += moveI;
      currentCol += moveJ;
    }
  }

  return possibleMoves;
};

export const knightKing = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  const { pieceType, row, col } = props;
  let possibleMoves: moves_Type[] = [];
  const moves: { row: number; col: number }[] = pieceMovement[pieceType];

  for (let i = 0; i < moves.length; i++) {
    const newRow: number = row + moves[i].row;
    const newCol: number = col + moves[i].col;
    const res = pieceOnLoc(boardData, { row: newRow, col: newCol });
    if (res === "empty square" || res === "opponent piece")
      possibleMoves.push({
        type: pieceType + res === "empty square" ? "normal" : "capture",
        row: newRow,
        col: newCol,
      });
  }

  return possibleMoves;
};

export const pawn = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  const { row, col } = props;
  const { turn } = boardData;
  let possibleMoves: moves_Type[] = [];
  const forward = turn === "white" ? -1 : 1;

  // Check one square forward
  let newRow = row + forward;
  let newCol = col;
  if (pieceOnLoc(boardData, { row: newRow, col: newCol }) === "empty square") {
    possibleMoves.push({ type: "pawn normal", row: newRow, col: newCol });

    // Check two squares forward if on starting position
    newRow = row + 2 * forward;
    if ((turn === "white" && row === 6) || (turn === "black" && row === 1)) {
      if (pieceOnLoc(boardData, { row: newRow, col: newCol }) === "empty square") {
        possibleMoves.push({ type: "pawn double forward", row: newRow, col: newCol });
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
    const res = pieceOnLoc(boardData, { row: newRow, col: newCol });
    if (res === "opponent piece") {
      possibleMoves.push({ type: "pawn capture", row: newRow, col: newCol });
    }
  }

  return possibleMoves;
};

const pieceFunctions: { [key: string]: (boardData: boardData_Type, props: Row_Col_PieceType_Type) => moves_Type[] } = {
  rook: rookBishopQueen,
  bishop: rookBishopQueen,
  queen: rookBishopQueen,
  knight: knightKing,
  king: Kingcastle,
  pawn: pawnenpassent,
};

const findMoves = (boardData: boardData_Type, props: Row_Col_Type): moves_Type[] => {
  const { BoardLayout, turn } = boardData;
  const { row, col } = props;
  let ans: moves_Type[] = [];
  const square: { type: string; piece: string } = BoardLayout[row][col];

  if (square.type === turn && "" !== square.piece) {
    if (square.piece === "king" || square.piece === "pawn") ans = [...pieceFunctions[square.piece](boardData, { ...props, pieceType: square.piece })];
    else ans = [...pieceFunctions[square.piece](boardData, { ...props, pieceType: square.piece })];
  }
  return ans;
};

export const allMoves = (boardData: boardData_Type): moves_Type[][][] => {
  const validMoves: moves_Type[][][] = [];

  for (let row = 0; row < 8; row++) {
    const validMovesrow: moves_Type[][] = [];
    for (let col = 0; col < 8; col++) {
      validMovesrow.push(findMoves(boardData, { row, col }));
    }
    validMoves.push(validMovesrow);
  }
  return validMoves;
};
