// updateGameState.tsx
import { handleMoveProps } from "../types";
import { updatedMovesPlayed } from "./updateMovesPlayed";
import { movePiece } from "./movePiece";

const handleMove = (props: handleMoveProps) => {
  const { boardData, selectedPiece, setBoardData, setSelectedMoves, setSelectedPiece, row, col, Move } = props;

  // updating castling logic
  const movedpiece = boardData.BoardLayout[selectedPiece.row][selectedPiece.col];
  if (movedpiece.piece === "king") {
    boardData.iscastle[boardData.turn]["king"] = false;
  } else if (movedpiece.piece === "rook") {
    boardData.iscastle[boardData.turn][selectedPiece.col === 0 ? "leftrook" : selectedPiece.col === 7 ? "rightrook" : "leftrook"] = false;
  }

  // Update the moves
  boardData.movesPlayed = updatedMovesPlayed({ movesPlayed: boardData.movesPlayed, selectedPiece, BoardLayout: boardData.BoardLayout, row, col, Move });

  // to_be_edited to for loop and update changes;
  // Update the board
  let prev: { row: number; col: number } = { row: selectedPiece.row, col: selectedPiece.col };
  movePiece(boardData, Move, prev);

  // Toggle the turn and update
  boardData.turn = boardData.turn === "white" ? "black" : "white";

  setBoardData(boardData);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setSelectedMoves({ isShowHint: true, availableMoves: [] });
};

export default handleMove;
