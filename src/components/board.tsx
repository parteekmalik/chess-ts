import React, { useState,useEffect } from "react";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import "./board.css";
import findValidMoves from "./ValidMovesLogic/findValidMoves";
import { initialPosition, BoardDataType, checkForValidClick, MovesPlayedType } from "./types";
import { boardSize } from "./types";
import { handleMove } from "./ValidMovesLogic/updateGameState";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardDataType>({ BoardLayout: initialPosition, turn: "white", ValidMoves: findValidMoves({ BoardLayout: initialPosition, turn: "white" }) });

  const [hints, setHints] = useState<{ isShowHint: boolean; hints: { row: number; col: number }[] }>({ isShowHint: true, hints: [] });
  const [selectedPiece, setSelectedPiece] = useState<{ isSelected: boolean; row: number; col: number }>({ isSelected: false, row: 0, col: 0 });
  const [movesPlayed, setMovesPlayed] = useState<MovesPlayedType>({ current: -1, moves: [] });

  useEffect(()=>{
    console.log(boardData.BoardLayout);
  },[boardData.BoardLayout]);
  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (hints.hints.some((hint) => hint.row === row && hint.col === col)) {
      handleMove({ boardData, selectedPiece, row, col, setBoardData, setHints, setSelectedPiece, movesPlayed, setMovesPlayed });
    } else if (boardData.BoardLayout[row][col].type !== "empty") {
      setSelectedPiece({ isSelected: true, row, col });
      setHints({ ...hints, hints: boardData.ValidMoves[row][col] });
    } else {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      setHints({ isShowHint: true, hints: [] });
    }
  };

  return (
    <div className="chess-board" onClick={clickHandle} style={{width: boardSize + "px",height: boardSize + "px"}}>
      <ChessBoard BoardLayout={boardData.BoardLayout} />
      <ChessBoardHints Hints={hints} BoardLayout={boardData.BoardLayout} />
    </div>
  );
};

export default Board;
