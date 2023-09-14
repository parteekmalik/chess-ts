// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";HandleMove
import { boardSize, initialPosition, checkForValidClick, boardData_Type, HintsProps, selectedPieceProps } from "./types";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import findValidMoves from "./ValidMovesLogic/findValidMoves";
import HandleMove  from "./ValidMovesLogic/updateGameState";
import Highlight from "./highlight/highlight";

let ValidMoves: { row: number; col: number }[][][];


const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<boardData_Type>({BoardLayout: initialPosition, turn: "white", movesPlayed: {current: -1,moves: []}});
  const [hints, setHints] = useState<HintsProps>({ isShowHint: true, hints: [] });
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, row: 0, col: 0 });

  useEffect(() => {
    ValidMoves = findValidMoves({ BoardLayout: boardData.BoardLayout, turn: boardData.turn, movesPlayed: boardData.movesPlayed });
  }, [boardData.BoardLayout, boardData.turn]);

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (hints.hints.some((hint) => hint.row === row && hint.col === col)) {
      HandleMove({ boardData, selectedPiece, setBoardData, setHints, setSelectedPiece, row, col });
    } else if (boardData.BoardLayout[row][col].type !== "empty") {
      setSelectedPiece({ isSelected: true, row, col });
      setHints({ ...hints, hints: ValidMoves[row][col] });
    } else {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      setHints({ isShowHint: true, hints: [] });
    }
  };

  return (
    <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
      <Highlight selectedPiece={selectedPiece} movesPlayed={boardData.movesPlayed} />
      <ChessBoard BoardLayout={boardData.BoardLayout} />
      <ChessBoardHints Hints={hints} BoardLayout={boardData.BoardLayout} />
    </div>
  );
};

export default Board;
