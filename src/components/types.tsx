export interface movesPlayedMove_type {
  type: string;

  from: { row: number; col: number; piece: { type: string; piece: string } };
  to: { row: number; col: number; piece: { type: string; piece: string } };
  castle?: {
    from: { row: number; col: number; piece: { type: string; piece: string } };
    to: { row: number; col: number; piece: { type: string; piece: string } };
  };
}
export interface MovesPlayed_Type {
  current: number;
  moves: movesPlayedMove_type[];
}
export interface HintsProps {
  isShowHint: boolean;
  availableMoves: moves_Type[];
}
export interface selectedPieceProps {
  isSelected: boolean;
  row: number;
  col: number;
}
export interface boardData_Type {
  BoardLayout: { type: string; piece: string }[][];
  turn: string;
  movesPlayed: MovesPlayed_Type;
  iscastle: { [key: string]: { [key: string]: boolean } };
}

export interface handleMoveProps {
  boardData: boardData_Type;
  setBoardData: React.Dispatch<React.SetStateAction<boardData_Type>>;
  selectedPiece: selectedPieceProps;
  setSelectedPiece: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
  setSelectedMoves: React.Dispatch<React.SetStateAction<HintsProps>>;
  Move: moves_Type;
}

export interface updatedMovesPlayedProps {
  selectedPiece: selectedPieceProps;
  BoardLayout: { type: string; piece: string }[][];
  movesPlayed: MovesPlayed_Type;
  Move: moves_Type;
}

export interface Row_Col_Type {
  row: number;
  col: number;
}

export interface PieceType_Type {
  pieceType: string;
}

export interface moves_Type {
  type: string;
  row: number;
  col: number;
}

export interface Row_Col_PieceType_Type extends Row_Col_Type, PieceType_Type {}

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
export const initialPosition: { type: string; piece: string }[][] = [
  [
    { type: "black", piece: "rook" },
    { type: "black", piece: "knight" },
    { type: "black", piece: "bishop" },
    { type: "black", piece: "queen" },
    { type: "black", piece: "king" },
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
    { type: "white", piece: "pawn" },
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
    { type: "white", piece: "queen" },
    { type: "white", piece: "king" },
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
export const emptyPiece: { type: string; piece: string } = { type: "empty", piece: "" };
export const boardSize: number = 600;
export const squareSize: number = boardSize / 8;
