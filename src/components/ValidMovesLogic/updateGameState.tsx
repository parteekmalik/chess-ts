// updateGameState.tsx
import { emptyPiece, MovesPlayedType, handleMoveProps } from "../types";

export const handleMove = (props: handleMoveProps) => {
  const { BoardLayout, selectedPiece, movesPlayed, turn, setBoardLayout, setHints, setSelectedPiece, setMovesPlayed, setTurn, row, col } = props;
  // Increment current moves and update moves array
  const updatedMovesPlayed: MovesPlayedType = {
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

  // Update the board
  const updatedBoard: { type: string; piece: string }[][] = [...BoardLayout];
  const pieceToMove = { ...updatedBoard[selectedPiece.row][selectedPiece.col] };
  updatedBoard[row][col] = pieceToMove;
  updatedBoard[selectedPiece.row][selectedPiece.col] = { ...emptyPiece };

  // Toggle the turn and update
  setTurn(turn === "white" ? "black" : "white");

  // Update board data with the new board layout and valid moves
  setBoardLayout(updatedBoard);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setHints({ isShowHint: true, hints: [] });

  // Update the moves played state
  setMovesPlayed(updatedMovesPlayed);
};
