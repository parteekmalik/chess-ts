export interface BoardDataType {
  BoardLayout: { type: string; piece: string }[][];
  turn: string;
  ValidMoves: { row: number; col: number }[][][];
}
export interface MovesPlayedType {
  current: number;
  moves: { from: { row: number; col: number; piece: { type: string; piece: string } }; to: { row: number; col: number; piece: { type: string; piece: string } } }[];
}

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
export interface handleMoveProps { 
  boardData: BoardDataType,
  selectedPiece: { isSelected: boolean; row: number; col: number },
  movesPlayed: MovesPlayedType,
  row: number,
  col: number,
  setBoardData: React.Dispatch<React.SetStateAction<BoardDataType>>,
  setHints: React.Dispatch<React.SetStateAction<{ isShowHint: boolean; hints: { row: number; col: number }[] }>>,
  setSelectedPiece: React.Dispatch<React.SetStateAction<{ isSelected: boolean; row: number; col: number }>>,
  setMovesPlayed: React.Dispatch<React.SetStateAction<MovesPlayedType>>
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
export const emptyPiece: { type: string; piece: string } = { type: "empty", piece: "" };
export const initialPosition: { type: string; piece: string }[][] = [
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
export const pieceSize: number = 50;

export const checkForValidClick = (event: React.MouseEvent) => {
  const { clientX, clientY, currentTarget } = event;
  const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

  // Check if the click is within the boundaries of the target element
  const isValid = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

  const col = isValid ? Math.floor((clientX - left) / pieceSize) : -1;
  const row = isValid ? Math.floor((clientY - top) / pieceSize) : -1;

  return { isValid, row, col };
};
