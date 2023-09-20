import { moves_Type, BoardLayout_Turn_Row_Col_PieceType_Movesplayed_Type } from "../types";
import { knightKing, pieceOnLoc } from "./pieceLogic";

// export interface iskingandrookmovedProps extends movesplayed_Type, Turn_Type {}
// const iskingandrookmoved = (props: iskingandrookmovedProps): boolean => {
//   const { movesPlayed, turn } = props;
//   movesPlayed.moves.forEach((move)=>{
//     if()return false;
//   })
//   return true;
// };

export const knightKingcastle = (props: BoardLayout_Turn_Row_Col_PieceType_Movesplayed_Type): moves_Type[] => {
  const { BoardLayout, turn, row, col, pieceType, movesPlayed } = props;
  let possibleMoves: moves_Type[] = knightKing({ BoardLayout, turn, row, col, pieceType });

  // to_be_edited write logic for en passet move(make a special move type)
  if (turn === "white" && ) {
  }

  return possibleMoves;
};

export const pawn = (props: BoardLayout_Turn_Row_Col_PieceType_Movesplayed_Type): moves_Type[] => {
  const { BoardLayout, turn, row, col, movesPlayed } = props;
  let possibleMoves: moves_Type[] = [];
  const forward = turn === "white" ? -1 : 1;

  // Check one square forward
  let newRow = row + forward;
  let newCol = col;
  if (pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol }) === "empty square") {
    possibleMoves.push({ type: "pawn normal", hint: { row: newRow, col: newCol }, toBeMoved: [{ row: newRow, col: newCol }] });

    // Check two squares forward if on starting position
    newRow = row + 2 * forward;
    if ((turn === "white" && row === 6) || (turn === "black" && row === 1)) {
      if (pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol }) === "empty square") {
        possibleMoves.push({ type: "pawn double forward", hint: { row: newRow, col: newCol }, toBeMoved: [{ row: newRow, col: newCol }] });
      }
    }
  }

  // Check diagonal captures
  const diagonalMoves = [
    { row: forward, col: -1 },
    { row: forward, col: 1 },
  ];
  for (const move of diagonalMoves) {
    newRow = row + move.row;
    newCol = col + move.col;
    const res = pieceOnLoc({ BoardLayout, turn, row: newRow, col: newCol });
    if (res === "opponent piece") {
      possibleMoves.push({ type: "pawn capture", hint: { row: newRow, col: newCol }, toBeMoved: [{ row: newRow, col: newCol }] });
    }
  }

  // to_be_edited write logic for en passet move(make a special move type)
  // console.log(movesPlayed,movesPlayed.moves[movesPlayed.moves.length-1])
  if (
    movesPlayed.moves.length > 0 &&
    movesPlayed.moves[movesPlayed.moves.length - 1].type === "pawn double forward" &&
    movesPlayed.moves[movesPlayed.moves.length - 1].to.row === row &&
    Math.abs(movesPlayed.moves[movesPlayed.moves.length - 1].to.col - col) === 1
  ) {
    newRow = row + (turn === "white" ? -1 : +1);
    newCol = movesPlayed.moves[movesPlayed.moves.length - 1].to.col;
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
