import { PieceSymbol, Square } from "chess.js";

export interface HintsProps {
  isShowHint: boolean;
  availableMoves: { from: Square; to: Square; promotion: PieceSymbol | undefined }[];
}
export interface selectedPieceProps {
  isSelected: boolean;
  square: Square;
}

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
