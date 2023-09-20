import { updatedMovesPlayedProps, MovesPlayed_Type } from "../types";

// to_be_edited to a new type which holds which hold prev data and after data someting like that
// Increment current moves and update moves array
export const updatedMovesPlayed = (props: updatedMovesPlayedProps): MovesPlayed_Type => {
  let { movesPlayed, selectedPiece, BoardLayout, row, col,Move } = props;
  return {
    current: movesPlayed.current + 1,
    moves: [
      ...movesPlayed.moves,
      {
        type: Move.type,
        from: {
          row: selectedPiece.row,
          col: selectedPiece.col,
          piece: BoardLayout[selectedPiece.row][selectedPiece.col],
        },
        to: { row, col, piece: BoardLayout[row][col] },
        toBeMoved:Move.toBeMoved,
      },
    ],
  };
};
