import {
  emptyPiece,
  BoardLayout_Turn_Movesplayed_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_To_Type,
} from "../../types";
import { updatedMovesPlayed } from "../../dispatch/updateMovesPlayed";
import _ from "lodash";

import { iskingInCheck } from "../king check/isKingInCheck";

// Helper function to make a move
const makeMove = (props: BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_To_Type): BoardLayout_Turn_Movesplayed_Type => {
  const newProps = _.cloneDeep(props);
  let { BoardLayout, to, row, col, turn, movesPlayed } = newProps;

  movesPlayed = { ...updatedMovesPlayed({ movesPlayed, selectedPiece: { isSelected: true, row: to.row, col: to.col }, BoardLayout, row, col }) };
  // Perform the move
  BoardLayout[to.row][to.col] = BoardLayout[row][col];
  BoardLayout[row][col] = emptyPiece;

  return { BoardLayout, turn, movesPlayed };
};

// Helper function to delete invalid moves
const deleteInvalid = (
  props: BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_Type
): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] => {
  const { ValidMoves, row, col } = props;
  const movesRow = ValidMoves[row][col];
  const newMovesRow: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] = [];

  for (let i = 0; i < movesRow.length; i++) {
    let boardData = makeMove({ ...props, to: { row: movesRow[i].row, col: movesRow[i].col } });

    // Check if the king is in check after the move
    if (!iskingInCheck(boardData)) {
      newMovesRow.push(movesRow[i]);
    }
  }

  return newMovesRow;
};

// Helper function to remove invalid moves from the ValidMoves array
const removeInvalidMoves = (
  props: BoardLayout_Turn_ValidMoves_MovesPlayed_Type
): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] => {
  let { ValidMoves } = props;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ValidMoves[row][col] = deleteInvalid({ ...props, row, col });
    }
  }

  return ValidMoves;
};
export { removeInvalidMoves };
export default removeInvalidMoves;
