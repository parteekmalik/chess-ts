export interface MovesPlayedType {
  current: number;
  moves: { from: { row: number; col: number; piece: { type: string; piece: string } }; to: { row: number; col: number; piece: { type: string; piece: string } } }[];
}
export interface HintsProps {
  isShowHint: boolean;
  hints: { row: number; col: number }[];
}
export interface selectedPieceProps {
  isSelected: boolean;
  row: number;
  col: number;
}


export interface boardType {
  BoardLayout: { type: string; piece: string }[][];
}
export interface FindValidMovesProps extends boardType {
  turn: string;
  movesPlayed: MovesPlayedType;
}
export interface BoardDataType extends boardType {
  turn: string;
  ValidMoves: { row: number; col: number }[][][];
}
export interface removeInvalidMovesProps extends BoardDataType{
  movesPlayed: MovesPlayedType;
  
}

export interface deleteInvalidProps extends BoardDataType {
  row: number;
  col: number;
  movesPlayed: MovesPlayedType;
}
export interface makemoveProps extends deleteInvalidProps {
  to: { row: number; col: number };
  movesPlayed: MovesPlayedType;
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
export interface updatedMovesPlayedProps{
  selectedPiece: selectedPieceProps;
  BoardLayout: { type: string; piece: string }[][];
  movesPlayed: MovesPlayedType;
  row: number;
  col: number;
}
export interface handleMoveProps {
  BoardLayout: { type: string; piece: string }[][];
  setBoardLayout: React.Dispatch<React.SetStateAction<{ type: string; piece: string }[][]>>;
  selectedPiece: selectedPieceProps;
  setSelectedPiece: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
  movesPlayed: MovesPlayedType;
  setMovesPlayed: React.Dispatch<React.SetStateAction<MovesPlayedType>>;
  turn: string;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  setHints: React.Dispatch<React.SetStateAction<HintsProps>>;
  row: number;
  col: number;
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

export const checkForValidClick = (event: React.MouseEvent) => {
  const { clientX, clientY, currentTarget } = event;
  const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

  // Check if the click is within the boundaries of the target element
  const isValid = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

  const col = isValid ? Math.floor((clientX - left) / squareSize) : -1;
  const row = isValid ? Math.floor((clientY - top) / squareSize) : -1;

  return { isValid, row, col };
};
export const boardSize: number = 600;
export const squareSize: number = boardSize / 8;
