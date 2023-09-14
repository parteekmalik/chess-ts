import {
  emptyPiece,
  BoardLayout_Turn_Movesplayed_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_Type,
  BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_To_Type,
} from "../types";
import { kingInCheck, allMoves } from "./pieceLogic";
import { updatedMovesPlayed } from "./updateMovesPlayed";
import _ from "lodash";

// Helper function to make a move
const makeMove = (props: BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_To_Type): BoardLayout_Turn_Movesplayed_Type => {
  const newProps = _.cloneDeep(props);
  let { BoardLayout, to, row, col, turn, movesPlayed } = newProps;

  movesPlayed = { ...updatedMovesPlayed({ movesPlayed, selectedPiece: { isSelected: true, row: to.row, col: to.col }, BoardLayout, row, col }) };
  // Perform the move
  BoardLayout[to.row][to.col] = BoardLayout[row][col];
  BoardLayout[row][col] = emptyPiece;

  // Toggle the turn
  turn = turn === "white" ? "black" : "white";

  return { BoardLayout, turn, movesPlayed };
};

// Helper function to delete invalid moves
const deleteInvalid = (props: BoardLayout_Turn_ValidMoves_MovesPlayed_Row_Col_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] => {
  const { ValidMoves, row, col } = props;
  const movesRow = ValidMoves[row][col];
  const newMovesRow: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[] = [];

  for (let i = 0; i < movesRow.length; i++) {
    let boardData = makeMove({ ...props, to: { row: movesRow[i].row, col: movesRow[i].col } });

    // Check if the king is in check after the move
    if (!kingInCheck(boardData)) {
      newMovesRow.push(movesRow[i]);
    }
  }

  return newMovesRow;
};

// Helper function to remove invalid moves from the ValidMoves array
const removeInvalidMoves = (props: BoardLayout_Turn_ValidMoves_MovesPlayed_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] => {
  let { ValidMoves } = props;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ValidMoves[row][col] = deleteInvalid({ ...props, row, col });
    }
  }

  return ValidMoves;
};

// Main function to find valid moves
const findValidMoves = (props: BoardLayout_Turn_Movesplayed_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] => {
  console.log("Calculating moves...");

  // Generate all possible moves
  let allMove: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] = allMoves(props);

  // Remove invalid moves
  let validMoves: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] = removeInvalidMoves({ ...props, ValidMoves: _.cloneDeep(allMove) });

  return validMoves;
};

export default findValidMoves;
