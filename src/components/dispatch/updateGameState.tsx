// updateGameState.tsx
import { handleMoveProps } from "../types";
import { updatedMovesPlayed } from "./updateMovesPlayed";
import { movePiece } from "../ValidMovesLogic/logic/movePiece";
import _ from "lodash";

const handleMove = (props: handleMoveProps) => {
  const { selectedPiece, setBoardData, setSelectedMoves, setSelectedPiece, Move } = props;
  let boardData = props.boardData;

  // updating castling logic
  const movedpiece = boardData.BoardLayout[selectedPiece.row][selectedPiece.col];
  if (movedpiece[1] === "K") {
    boardData.iscastle[boardData.turn]["King"] = false;
  } else if (movedpiece[1] === "R") {
    boardData.iscastle[boardData.turn][selectedPiece.col === 0 ? "leftRook" : selectedPiece.col === 7 ? "rightRook" : "leftRook"] = false;
  }

  // Update the moves
  boardData.movesPlayed.current += 1;
  boardData.movesPlayed.moves = [
    ...boardData.movesPlayed.moves,
    updatedMovesPlayed({ movesPlayed: boardData.movesPlayed, selectedPiece, BoardLayout: boardData.BoardLayout, Move }),
  ];

  // Update the board
  boardData = movePiece(_.cloneDeep(boardData));

  // Toggle the turn and update
  boardData.turn = boardData.turn === "w" ? "b" : "w";

  setBoardData(boardData);

  // Reset selected piece and hints
  setSelectedPiece({ isSelected: false, row: 0, col: 0 });
  setSelectedMoves({ isShowHint: true, availableMoves: [] });
};

export default handleMove;
