// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, initialPosition, checkForValidClick, boardData_Type, HintsProps, selectedPieceProps, moves_Type } from "./types";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import findValidMoves from "./ValidMovesLogic/findValidMoves";
import HandleMove from "./dispatch/updateGameState";
import Highlight from "./highlight/highlight";
import Coordinates from "./coordinates/coordinates";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<boardData_Type>({
    BoardLayout: initialPosition,
    turn: "white",
    movesPlayed: { current: -1, moves: [] },
    iscastle: { black: { King: true, rightRook: true, leftRook: true }, white: { King: true, rightRook: true, leftRook: true } },
  });
  const [SelectedMoves, setSelectedMoves] = useState<HintsProps>({ isShowHint: true, availableMoves: [] });
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, row: 0, col: 0 });
  const [ValidMoves, setValidMoves] = useState<moves_Type[][][]>([]);

  useEffect(() => {
    setValidMoves(findValidMoves(boardData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardData.turn]);

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (SelectedMoves.availableMoves.some((hint) => hint.row === row && hint.col === col)) {
      SelectedMoves.availableMoves.forEach((moves) => {
        if (moves.row === row && moves.col === col) HandleMove({ boardData, selectedPiece, setBoardData, setSelectedMoves, setSelectedPiece, Move: moves });
      });
    } else if (boardData.BoardLayout[row][col].type !== "empty") {
      setSelectedPiece({ isSelected: true, row, col });
      setSelectedMoves({ ...SelectedMoves, availableMoves: ValidMoves[row][col] });
    } else {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      setSelectedMoves({ ...SelectedMoves, availableMoves: [] });
    }
  };

  return (
    <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
      <Coordinates />
      <Highlight selectedPiece={selectedPiece} movesPlayed={boardData.movesPlayed} />
      <ChessBoard BoardLayout={boardData.BoardLayout} />
      <ChessBoardHints Hints={SelectedMoves.availableMoves} BoardLayout={boardData.BoardLayout} />
    </div>
  );
};

export default Board;
