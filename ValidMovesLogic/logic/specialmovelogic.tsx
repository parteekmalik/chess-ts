import { moves_Type, boardData_Type, Row_Col_PieceType_Type } from "../../types";
import { deleteInvalid } from "../deleteValidMove/deleteInvalid";
import { iskingInCheck } from "../king check/isKingInCheck";
import { knightKing, pawn, pieceOnLoc } from "./pieceLogic";

const chackForBlank = (boardData: boardData_Type, moves: moves_Type[]): boolean => {
  for (let i = 1; i < moves.length; i++) {
    let res = pieceOnLoc(boardData, { row: moves[i].row, col: moves[i].col });
    if (res[0] !== "E") return false;
  }
  return true;
};

export const Kingcastle = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  let possibleMoves: moves_Type[] = knightKing(boardData, props);
  const { turn } = boardData;
  const { row, col } = props;

  const iscastle = boardData.iscastle[turn];
  const rowRank = turn === "w" ? 7 : 0;
  if (iscastle["King"] && !iskingInCheck(boardData)) {
    const caslemoves = [
      [
        { type: "", row: rowRank, col: 0 },
        { type: "", row: rowRank, col: 1 },
        { type: "", row: rowRank, col: 2 },
        { type: "", row: rowRank, col: 3 },
      ],
      [
        { type: "", row: rowRank, col: 7 },
        { type: "", row: rowRank, col: 6 },
        { type: "", row: rowRank, col: 5 },
      ],
    ];

    if (iscastle["leftRook"] && chackForBlank(boardData, caslemoves[0]) && deleteInvalid(boardData, caslemoves[0], { row, col }).length === 4)
      possibleMoves.push({ type: "o-o-o", row: rowRank, col: 2 });

    if (iscastle["rightRook"] && chackForBlank(boardData, caslemoves[1]) && deleteInvalid(boardData, caslemoves[1], { row, col }).length === 3)
      possibleMoves.push({ type: "o-o", row: rowRank, col: 6 });
  }

  return possibleMoves;
};

export const pawnenpassent = (boardData: boardData_Type, props: Row_Col_PieceType_Type): moves_Type[] => {
  const { movesPlayed, turn } = boardData;
  const { row, col } = props;
  let possibleMoves: moves_Type[] = pawn(boardData, props);

  if (
    movesPlayed.moves.length > 0 &&
    movesPlayed.moves[movesPlayed.moves.length - 1].type === "pawn double forward" &&
    movesPlayed.moves[movesPlayed.moves.length - 1].to.row === row &&
    Math.abs(movesPlayed.moves[movesPlayed.moves.length - 1].to.col - col) === 1
  ) {
    let newRow = row + (turn === "w" ? -1 : +1);
    let newCol = movesPlayed.moves[movesPlayed.moves.length - 1].to.col;
    possibleMoves.push({ type: "pawn en passent", row: newRow, col: newCol });
  }

  return possibleMoves;
};
