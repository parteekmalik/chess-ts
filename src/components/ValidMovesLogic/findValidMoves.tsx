// findValidMoves.tsx
import { FindValidMovesProps, BoardDataType, deleteInvalidProps, makemoveProps, emptyPiece } from "../types";
import { kingInCheck, allMoves } from "./pieceLogic";
import _ from "lodash";

const makemove = (props: makemoveProps): FindValidMovesProps => {
  const newprop = _.cloneDeep(props);
  let { BoardLayout, to, row, col, turn } = newprop;
  BoardLayout[to.row][to.col] = BoardLayout[row][col];
  BoardLayout[row][col] = emptyPiece;
  turn = turn === "white" ? "black" : "white";
  return { BoardLayout, turn };
};

const deleteInvalid = (props: deleteInvalidProps): { row: number; col: number }[] => {
  const { ValidMoves, row, col } = props;
  const movesRow = ValidMoves[row][col];
  const newMovesRow: { row: number; col: number }[] = [];
  for (let i = 0; i < movesRow.length; i++) {
    let boardData = makemove({ ...props, to: { row: movesRow[i].row, col: movesRow[i].col } });
    if (!kingInCheck(boardData)) {
      newMovesRow.push(movesRow[i]);
    }
  }

  return newMovesRow;
};

const removeInvalidMoves = (props: BoardDataType): { row: number; col: number }[][][] => {
  let { ValidMoves } = props;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ValidMoves[row][col] = deleteInvalid({ ...props, row, col });
    }
  }

  return ValidMoves;
};

const findValidMoves = (props: FindValidMovesProps): { row: number; col: number }[][][] => {
  console.log("moves calculated");
  let allMove: { row: number; col: number }[][][] = allMoves(props);
  let validMoves: { row: number; col: number }[][][] = removeInvalidMoves({ ...props, ValidMoves: _.cloneDeep(allMove) });

  return validMoves;
};

export default findValidMoves;
