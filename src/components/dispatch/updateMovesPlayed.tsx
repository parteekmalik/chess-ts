import { updatedMovesPlayedProps, movesPlayedMove_type } from "../types";

// to_be_edited to a new type which holds which hold prev data and after data someting like that
// Increment current moves and update moves array

export const updatedMovesPlayed = (props: updatedMovesPlayedProps): movesPlayedMove_type => {
  let { selectedPiece, BoardLayout, Move } = props;
  const { row, col } = Move;
  if (Move.type === "o-o-o") {
    return {
      type: Move.type,

      from: {
        row: selectedPiece.row,
        col: selectedPiece.col,
        piece: BoardLayout[selectedPiece.row][selectedPiece.col],
      },
      to: { row, col, piece: BoardLayout[row][col] },

      castle: {
        from: {
          row: selectedPiece.row,
          col: 0,
          piece: BoardLayout[selectedPiece.row][0],
        },
        to: { row, col: col + 1, piece: BoardLayout[row][col + 1] },
      },
    };
  } else if (Move.type === "o-o") {
    return {
      type: Move.type,

      from: {
        row: selectedPiece.row,
        col: selectedPiece.col,
        piece: BoardLayout[selectedPiece.row][selectedPiece.col],
      },
      to: { row, col, piece: BoardLayout[row][col] },

      castle: {
        from: {
          row: selectedPiece.row,
          col: 7,
          piece: BoardLayout[selectedPiece.row][7],
        },
        to: { row, col: 5, piece: BoardLayout[row][5] },
      },
    };
  }
  return {
    type: Move.type,

    from: {
      row: selectedPiece.row,
      col: selectedPiece.col,
      piece: BoardLayout[selectedPiece.row][selectedPiece.col],
    },
    to: { row, col, piece: BoardLayout[row][col] },
  };
};
