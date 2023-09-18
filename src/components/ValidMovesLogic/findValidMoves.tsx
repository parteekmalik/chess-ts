import { BoardLayout_Turn_Movesplayed_Type } from "../types";
import { allMoves } from "./pieceLogic";
import _ from "lodash";

import { removeInvalidMoves } from "./deleteValidMove/deleteInvalid";

// Main function to find valid moves
const findValidMoves = (props: BoardLayout_Turn_Movesplayed_Type): { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] => {
  console.log("Calculating moves...");

  // Generate all possible moves
  let allMove: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] = allMoves(props);

  // Remove invalid moves
  let validMoves: { type: string; row: number; col: number; toBeMoved: { row: number; col: number }[] }[][][] = removeInvalidMoves({
    ...props,
    ValidMoves: _.cloneDeep(allMove),
  });

  return validMoves;
};

export default findValidMoves;
