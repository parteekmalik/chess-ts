import { boardType, FindValidMovesProps, FindMovesProps, PieceMovementProps, continusMovesProps } from "./types";

import { pieceFunctions } from "./pieceLogic";

const findMoves = (props: FindMovesProps): { row: number; col: number }[] => {
  const { BoardLayout, turn, row, col } = props;
  let ans: { row: number; col: number }[] = [];
  const square: { type: string; piece: string } = BoardLayout[row][col];

  if (square.type === turn && "" !== square.piece) {
    if (pieceFunctions.hasOwnProperty(square.piece)) {
      ans = [...pieceFunctions[square.piece]({ BoardLayout, turn, pieceType: square.piece, row, col })];
    }
  }
  return ans;
};

const findValidMoves = (props: FindValidMovesProps): { row: number; col: number }[][][] => {
  const validMoves: { row: number; col: number }[][][] = [];

  for (let row = 0; row < 8; row++) {
    const validMovesrow: { row: number; col: number }[][] = [];
    for (let col = 0; col < 8; col++) {
      validMovesrow.push(findMoves({ ...props, row, col }));
    }
    validMoves.push(validMovesrow);
  }

  console.log(validMoves);

  return validMoves;
};

export default findValidMoves;
