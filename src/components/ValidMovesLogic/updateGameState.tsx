// updateGameState.tsx
import { emptyPiece,selectedPieceProps,HintsProps } from "../types";
import { handleMoveProps } from "../types";
import {updatedMovesPlayed} from "./updateMovesPlayed"
import _ from "lodash";



 const handleMove = (props: handleMoveProps) => {
  const { boardData, selectedPiece, setBoardData, setHints, setSelectedPiece, row, col } = props;

  // Update the moves 
  boardData.movesPlayed = updatedMovesPlayed({movesPlayed: boardData.movesPlayed, selectedPiece, BoardLayout: boardData.BoardLayout, row, col});

  // Update the board
  boardData.BoardLayout[row][col] = { ...boardData.BoardLayout[selectedPiece.row][selectedPiece.col] };
  boardData.BoardLayout[selectedPiece.row][selectedPiece.col] = { ...emptyPiece };

  // Toggle the turn and update
  boardData.turn = (boardData.turn === "white") ? "black" : "white";
  
  setBoardData(boardData);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setHints({ isShowHint: true, hints: [] });
};

export default handleMove;