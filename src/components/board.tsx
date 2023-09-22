// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, initialPosition, checkForValidClick, boardData_Type, HintsProps, selectedPieceProps, moves_Type } from "./types";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import findValidMoves from "./ValidMovesLogic/findValidMoves";
import HandleMove from "./dispatch/updateGameState";
import Highlight from "./highlight/highlight";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<boardData_Type>({
    BoardLayout: initialPosition,
    turn: "white",
    movesPlayed: { current: -1, moves: [] },
    iscastle: { black: { king: true, rightrook: true, leftrook: true }, white: { king: true, rightrook: true, leftrook: true } },
  });
  const [SelectedMoves, setSelectedMoves] = useState<HintsProps>({ isShowHint: true, availableMoves: [] });
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, row: 0, col: 0 });
  const [ValidMoves, setValidMoves] = useState<moves_Type[][][]>([])

  useEffect(() => {
    setValidMoves(findValidMoves(boardData));
    console.log(boardData.iscastle);
    // console.log(boardData.movesPlayed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardData.turn]);

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (SelectedMoves.availableMoves.some((hint) => hint.hint.row === row && hint.hint.col === col)) {
      SelectedMoves.availableMoves.forEach((moves) => {
        if (moves.hint.row === row && moves.hint.col === col)
          HandleMove({ boardData, selectedPiece, setBoardData, setSelectedMoves, setSelectedPiece, row, col, Move: moves });
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
      <Highlight selectedPiece={selectedPiece} movesPlayed={boardData.movesPlayed} />
      <ChessBoard BoardLayout={boardData.BoardLayout} />
      <ChessBoardHints Hints={SelectedMoves.availableMoves} BoardLayout={boardData.BoardLayout} />
    </div>
  );
};

export default Board;
