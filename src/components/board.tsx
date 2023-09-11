// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import findValidMoves from "./ValidMovesLogic/findValidMoves";
import { initialPosition, checkForValidClick, MovesPlayedType } from "./types";
import { boardSize } from "./types";
import { handleMove } from "./ValidMovesLogic/updateGameState";
import Highlight from "./highlight/highlight";

let ValidMoves = findValidMoves({ BoardLayout: initialPosition, turn: "white" });

const Board: React.FC = () => {
  const [BoardLayout, setBoardLayout] = useState<{ type: string; piece: string }[][]>(initialPosition);
  const [turn, setTurn] = useState<string>("white");
  const [hints, setHints] = useState<{ isShowHint: boolean; hints: { row: number; col: number }[] }>({ isShowHint: true, hints: [] });
  const [selectedPiece, setSelectedPiece] = useState<{ isSelected: boolean; row: number; col: number }>({ isSelected: false, row: 0, col: 0 });
  const [movesPlayed, setMovesPlayed] = useState<MovesPlayedType>({ current: -1, moves: [] });

  useEffect(() => {
    ValidMoves = findValidMoves({ BoardLayout, turn });
  }, [BoardLayout, turn]);

  // useEffect(() => {
  //   console.log(movesPlayed);
  // }, [movesPlayed]);

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (hints.hints.some((hint) => hint.row === row && hint.col === col)) {
      handleMove({ BoardLayout, selectedPiece, movesPlayed, turn, setBoardLayout, setHints, setSelectedPiece, setMovesPlayed, setTurn, row, col });
    } else if (BoardLayout[row][col].type !== "empty") {
      setSelectedPiece({ isSelected: true, row, col });
      setHints({ ...hints, hints: ValidMoves[row][col] });
    } else {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      setHints({ isShowHint: true, hints: [] });
    }
  };

  return (
    <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
      <Highlight selectedPiece={selectedPiece} movesPlayed={movesPlayed} />
      <ChessBoard BoardLayout={BoardLayout} />
      <ChessBoardHints Hints={hints} BoardLayout={BoardLayout} />
    </div>
  );
};

export default Board;
