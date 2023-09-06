// updateGameState.tsx
import findValidMoves from "./findValidMoves";
import { emptyPiece, MovesPlayedType, handleMoveProps } from "../types";

export const handleMove = (props: handleMoveProps) => {
  const { boardData, selectedPiece, row, col, movesPlayed, setBoardData, setHints, setMovesPlayed, setSelectedPiece } = props;
  // Increment current moves and update moves array
  const updatedMovesPlayed: MovesPlayedType = {
    current: movesPlayed.current + 1,
    moves: [
      ...movesPlayed.moves,
      {
        from: {
          row: selectedPiece.row,
          col: selectedPiece.col,
          piece: boardData.BoardLayout[selectedPiece.row][selectedPiece.col],
        },
        to: { row, col, piece: boardData.BoardLayout[row][col] },
      },
    ],
  };

  // Update the board
  const updatedBoard: { type: string; piece: string }[][] = [...boardData.BoardLayout];
  const pieceToMove = { ...updatedBoard[selectedPiece.row][selectedPiece.col] };
  updatedBoard[row][col] = pieceToMove;
  updatedBoard[selectedPiece.row][selectedPiece.col] = { ...emptyPiece };

  // Toggle the turn
  const turn: string = boardData.turn === "white" ? "black" : "white";

  // Update board data with the new board layout and valid moves
  setBoardData({
    ...boardData,
    BoardLayout: updatedBoard,
    turn,
    ValidMoves: findValidMoves({ BoardLayout: updatedBoard, turn }),
  });

  setMovesPlayed(updatedMovesPlayed);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setHints({ isShowHint: true, hints: [] });

  // Update the moves played state
  setMovesPlayed(updatedMovesPlayed);
};
