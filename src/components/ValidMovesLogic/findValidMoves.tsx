import { BoardLayout_Turn_Movesplayed_Type, moves_Type } from "../types";
import { allMoves } from "./pieceLogic";
import _ from "lodash";

import { removeInvalidMoves } from "./deleteValidMove/deleteInvalid";

// Main function to find valid moves
const findValidMoves = (props: BoardLayout_Turn_Movesplayed_Type): moves_Type[][][] => {
  // Generate all possible moves
  let allMove: moves_Type[][][] = allMoves(props);

  // Remove invalid moves
  let validMoves: moves_Type[][][] = removeInvalidMoves({ ...props, ValidMoves: _.cloneDeep(allMove) });

  return validMoves;
};

export default findValidMoves;
