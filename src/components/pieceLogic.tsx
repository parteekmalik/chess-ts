import { boardType, FindValidMovesProps, FindMovesProps, PieceMovementProps, continusMovesProps } from "./types";
import { pieceMovement } from "./types";



const isValidMove = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };
  
  const pieceOnLoc = (props: FindMovesProps): string => {
    const { BoardLayout, turn, row, col } = props;
    if (!isValidMove(row, col)) return "invalid Pos";
    const square = BoardLayout[row][col].type;
    if (square === "empty") return "empty square";
    return square === turn ? "friendly piece" : "opponent piece";
  };
  
  const continusMoves = (props: continusMovesProps): { row: number; col: number }[] => {
    const { BoardLayout, turn, i, j } = props;
    let { row, col } = props;
    const possibleMoves: { row: number; col: number }[] = [];
  
    while (true) {
      row += i;
      col += j;
      const res = pieceOnLoc({ BoardLayout, turn, row, col });
  
      if (res === "empty square" || res === "opponent piece") possibleMoves.push({ row, col });
  
      if (res !== "empty square") break;
    }
    return possibleMoves;
  };
  
  const rookBishopQueen = (props: PieceMovementProps): { row: number; col: number }[] => {
    let possibleMoves: { row: number; col: number }[] = [];
    const moves: { row: number; col: number }[] = pieceMovement[props.pieceType];
  
    for (let i = 0; i < moves.length; i++) {
      possibleMoves = [...possibleMoves, ...continusMoves({ ...props, i: moves[i].row, j: moves[i].col })];
    }
  
    return possibleMoves;
  };
  
 export const pieceFunctions: { [key: string]: (props: PieceMovementProps) => { row: number; col: number }[] } = {
    Rk: rookBishopQueen,
    Bp: rookBishopQueen,
    Qn: rookBishopQueen,
  };

