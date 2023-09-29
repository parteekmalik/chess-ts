import { boardData_Type, moves_Type } from "../types";
import { allMoves } from "./pieceLogic";
// import _ from "lodash";

import { removeInvalidMoves } from "./deleteValidMove/deleteInvalid";

// Main function to find valid moves
const findValidMoves = (boardData: boardData_Type): moves_Type[][][] => {
  console.log("calculating move :");
  // Generate all possible moves
  let allMove: moves_Type[][][] = allMoves(boardData);

  // Remove invalid moves
  // let validMoves: moves_Type[][][] = removeInvalidMoves(boardData, allMove);
  console.log("calculation finished!!");
  return allMove;
};

export default findValidMoves;
