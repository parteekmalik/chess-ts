import {
  boardData_Type,
  moves_Type,
} from "../../types";
import _ from "lodash";
import { movePiece } from "../../dispatch/movePiece";
import { iskingInCheck } from "../king check/isKingInCheck";


// Helper function to delete invalid moves
export const deleteInvalid = (boardData:boardData_Type,movesRow: moves_Type[],prev:{row:number,col:number}): moves_Type[] => {
  const newMovesRow: moves_Type[] = [];

  for (let i = 0; i < movesRow.length; i++) {
    let newboardData = movePiece(_.cloneDeep(boardData),movesRow[i],prev);

    // Check if the king is in check after the move
    if (!iskingInCheck(newboardData)) {
      newMovesRow.push(movesRow[i]);
    }
  }

  return newMovesRow;
};

// Helper function to remove invalid moves from the ValidMoves array
export const removeInvalidMoves = (boardData:boardData_Type , ValidMoves:moves_Type[][][]): moves_Type[][][] => {

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ValidMoves[row][col] = deleteInvalid(boardData, ValidMoves[row][col], {row,col});
    }
  }

  return ValidMoves;
};
export default removeInvalidMoves;