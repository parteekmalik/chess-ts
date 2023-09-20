// updateGameState.tsx
import { emptyPiece } from "../types";
import { handleMoveProps } from "../types";
import { updatedMovesPlayed } from "./updateMovesPlayed";

const handleMove = (props: handleMoveProps) => {
  const { boardData, selectedPiece, setBoardData, setSelectedMoves, setSelectedPiece, row, col,Move } = props;

  // Update the moves
  boardData.movesPlayed = updatedMovesPlayed({ movesPlayed: boardData.movesPlayed, selectedPiece, BoardLayout: boardData.BoardLayout, row, col,Move });

  // to_be_edited to for loop and update changes;
  // Update the board
  let prev: {row:number,col:number} = {row:selectedPiece.row,col:selectedPiece.col}
  Move.toBeMoved.forEach((current) => {
    
    boardData.BoardLayout[current.row][current.col] = { ...boardData.BoardLayout[prev.row][prev.col] };
    boardData.BoardLayout[prev.row][prev.col] = { ...emptyPiece };
    prev = current;
  });

  // Toggle the turn and update
  boardData.turn = boardData.turn === "white" ? "black" : "white";

  setBoardData(boardData);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setSelectedMoves({ isShowHint: true, availableMoves: [] });
};

export default handleMove;
