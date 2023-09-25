import { boardData_Type, moves_Type } from "../types";
import { allMoves } from "./pieceLogic";
import { removeInvalidMoves } from "./deleteValidMove/deleteInvalid";

// Main function to find valid moves
const findValidMoves = (boardData: boardData_Type): moves_Type[][][] => {
  const allMove: moves_Type[][][] = allMoves(boardData);
  removeInvalidMoves(boardData, allMove);

  return allMove;
};

export default findValidMoves;
