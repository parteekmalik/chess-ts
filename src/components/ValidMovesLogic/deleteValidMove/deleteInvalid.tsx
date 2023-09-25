import { boardData_Type, moves_Type } from "../../types";
import _ from "lodash";
import { movePiece } from "../../dispatch/movePiece";
import { iskingInCheck } from "../king check/isKingInCheck";
import { updatedMovesPlayed } from "../../dispatch/updateMovesPlayed";

// Helper function to delete invalid moves
export const deleteInvalid = (boardData: boardData_Type, movesRow: moves_Type[], prev: { row: number; col: number }): moves_Type[] => {
  const newMovesRow: moves_Type[] = [];

  for (let i = 0; i < movesRow.length; i++) {
    // making move in copy of boardData
    let newboardData = _.cloneDeep(boardData);
    newboardData.movesPlayed.moves = [
      ...newboardData.movesPlayed.moves,
      updatedMovesPlayed({ movesPlayed: boardData.movesPlayed, selectedPiece: { ...prev, isSelected: true }, BoardLayout: newboardData.BoardLayout, Move: movesRow[i] }),
    ];

    movePiece(newboardData);

    if (!iskingInCheck(newboardData)) newMovesRow.push(movesRow[i]);
  }

  return newMovesRow;
};

// Helper function to remove invalid moves from the ValidMoves array
export const removeInvalidMoves = (boardData: boardData_Type, ValidMoves: moves_Type[][][]): moves_Type[][][] => {
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) ValidMoves[row][col] = deleteInvalid(boardData, ValidMoves[row][col], { row, col });

  return ValidMoves;
};
export default removeInvalidMoves;
