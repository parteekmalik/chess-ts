import { moves_Type, boardData_Type, Row_Col_PieceType_Type } from "../types";
import removeInvalidMoves, { deleteInvalid } from "./deleteValidMove/deleteInvalid";
import { knightKing, pawn } from "./pieceLogic";

export const iscastlepossible = (boardData: boardData_Type, props: Row_Col_PieceType_Type): boolean => {
  // if()
  return true;
}


export const Kingcastle = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  let possibleMoves: moves_Type[] = knightKing(boardData, props);
  const {BoardLayout,movesPlayed,turn} = boardData;
  const {row,col} = props;
  // to_be_edited write logic for castle move(make a special move type)
  const iscastle = boardData.iscastle[turn];
  const rowRank = turn === "white" ? 7 : 0;
  if (iscastle["king"]) {
    if(iscastle["leftrook"]){
      const moves = 
      [{type : "",hint:{row:rowRank,col:0},toBeMoved:[{row:rowRank,col:0}]},
      {type : "",hint:{row:rowRank,col:1},toBeMoved:[{row:rowRank,col:1}]},
      {type : "",hint:{row:rowRank,col:2},toBeMoved:[{row:rowRank,col:2}]},
      {type : "",hint:{row:rowRank,col:3},toBeMoved:[{row:rowRank,col:3}]},
      {type : "",hint:{row:rowRank,col:4},toBeMoved:[{row:rowRank,col:4}]},]
      if(deleteInvalid(boardData,moves,{row,col}).length === 5){
        possibleMoves.push({type:"o-o-o",hint:{row:rowRank,col:2},toBeMoved:[{row:rowRank,col:2}]})
      }
    }else if(iscastle["rightrook"]){

    }
  }

  return possibleMoves;
};


export const pawnenpassent = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  const { movesPlayed, turn } = boardData;
  const { row, col } = props;
  let possibleMoves: moves_Type[] = pawn(boardData,props);


  // to_be_edited write logic for en passet move(make a special move type)
  // console.log(movesPlayed,movesPlayed.moves[movesPlayed.moves.length-1])
  if (
    movesPlayed.moves.length > 0 &&
    movesPlayed.moves[movesPlayed.moves.length - 1].type === "pawn double forward" &&
    movesPlayed.moves[movesPlayed.moves.length - 1].to.row === row &&
    Math.abs(movesPlayed.moves[movesPlayed.moves.length - 1].to.col - col) === 1
  ) {
    let newRow = row + (turn === "white" ? -1 : +1);
    let newCol = movesPlayed.moves[movesPlayed.moves.length - 1].to.col;
    possibleMoves.push({
      type: "pawn en passent",
      hint: { row: newRow, col: newCol },
      toBeMoved: [
        { row: row, col: newCol },
        { row: newRow, col: newCol },
      ],
    });
  }

  return possibleMoves;
};
