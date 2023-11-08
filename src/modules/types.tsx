import { Color, PieceSymbol, Square, SQUARES } from "chess.js";

export interface HintsProps {
    isShowHint: boolean;
    availableMoves: { from: Square; to: Square; promotion: PieceSymbol | undefined }[];
}
export interface selectedPieceProps {
    isSelected: boolean;
    square: Square;
}

export const checkForValidClick = (event: React.MouseEvent, flip: Color) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

    // Check if the click is within the boundaries of the target element
    const isValid = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

    const squareSize: number = (bottom - top) / 8;

    const col = isValid ? Math.floor((clientX - left) / squareSize) : -1;
    const row = isValid ? Math.floor((clientY - top) / squareSize) : -1;

    if (flip != ("b" as Color)) return { isValid, square: SQUARES[row * 8 + col] };
    else return { isValid, square: SQUARES[(7 - row) * 8 + col] };
};

export const toRowCol = (square: Square): number[] => {
    const rowIndex = Math.floor(SQUARES.indexOf(square) / 8);
    const colIndex = SQUARES.indexOf(square) % 8;
    return [rowIndex, colIndex];
};
