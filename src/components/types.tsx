export interface boardType {
  BoardLayout: { type: string; piece: string }[][];
}
export interface FindValidMovesProps extends boardType {
  turn: string;
}

export interface FindMovesProps extends FindValidMovesProps {
  row: number;
  col: number;
}
export interface PieceMovementProps extends FindMovesProps {
  pieceType: string;
}
export interface continusMovesProps extends PieceMovementProps {
  i: number;
  j: number;
}

export const pieceMovement: { [key: string]: { row: number; col: number }[] } = {
  rook: [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ],
  bishop: [
    { row: 1, col: 1 },
    { row: -1, col: -1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
  ],
  knight: [
    { row: 2, col: 1 },
    { row: 2, col: -1 },
    { row: -2, col: 1 },
    { row: -2, col: -1 },
    { row: 1, col: 2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: -1, col: -2 },
  ],
  king: [
    { row: 1, col: 1 },
    { row: 0, col: 1 },
    { row: -1, col: 1 },
    { row: -1, col: 0 },
    { row: -1, col: -1 },
    { row: 0, col: -1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
  ],
  queen: [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: 1 },
    { row: -1, col: -1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
  ],
};
export const initialPoition: { type: string; piece: string }[][] = [
  [
    { type: "black", piece: "rook" },
    { type: "black", piece: "knight" },
    { type: "black", piece: "bishop" },
    { type: "black", piece: "king" },
    { type: "black", piece: "queen" },
    { type: "black", piece: "bishop" },
    { type: "black", piece: "knight" },
    { type: "black", piece: "rook" },
  ],
  [
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
  ],
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  [
    { type: "white", piece: "rook" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
  ],
  [
    { type: "white", piece: "rook" },
    { type: "white", piece: "knight" },
    { type: "white", piece: "bishop" },
    { type: "white", piece: "king" },
    { type: "white", piece: "queen" },
    { type: "white", piece: "bishop" },
    { type: "white", piece: "knight" },
    { type: "white", piece: "rook" },
  ],
];