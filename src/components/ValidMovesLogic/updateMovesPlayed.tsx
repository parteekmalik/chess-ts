import { updatedMovesPlayedProps, MovesPlayed_Type } from "../types";

// Increment current moves and update moves array
export const updatedMovesPlayed = (props: updatedMovesPlayedProps): MovesPlayed_Type => {
  let { movesPlayed, selectedPiece, BoardLayout, row, col } = props;
  return {
    current: movesPlayed.current + 1,
    moves: [
      ...movesPlayed.moves,
      {
        from: {
          row: selectedPiece.row,
          col: selectedPiece.col,
          piece: BoardLayout[selectedPiece.row][selectedPiece.col],
        },
        to: { row, col, piece: BoardLayout[row][col] },
      },
    ],
  };
};
