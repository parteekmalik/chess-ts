// updateGameState.tsx
import { emptyPiece, MovesPlayedType, handleMoveProps } from "../types";
import {updatedMovesPlayed} from "./updateMovesPlayed"

 const handleMove = (props: handleMoveProps) => {
  const { BoardLayout, selectedPiece, movesPlayed, turn, setBoardLayout, setMovesPlayed, setHints, setSelectedPiece, setTurn, row, col } = props;

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
  setMovesPlayed(updatedMovesPlayed({movesPlayed, selectedPiece, BoardLayout, row, col}));
};
export default handleMove;