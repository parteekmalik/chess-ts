import { boardData_Type, moves_Type } from "../types";
import { allMoves } from "./pieceLogic";
// import _ from "lodash";

// import { removeInvalidMoves } from "./deleteValidMove/deleteInvalid";

// Main function to find valid moves
const findValidMoves = (props: boardData_Type): moves_Type[][][] => {
  console.log("calculating move :")
  // Generate all possible moves
  let allMove: moves_Type[][][] = allMoves(props);

  // Remove invalid moves
  // let validMoves: moves_Type[][][] = removeInvalidMoves({ ...props, ValidMoves: _.cloneDeep(allMove) });
  console.log("calculation finished!!")
  return allMove;
};

export default findValidMoves;
