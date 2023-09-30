// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, initialPosition, checkForValidClick, boardData_Type, HintsProps, selectedPieceProps, moves_Type } from "../types";
import ChessBoard from "../piece and hints/ChessBoard";
import ChessBoardHints from "../piece and hints/ChessBoardHints";
import findValidMoves from "../ValidMovesLogic/findValidMoves";
import HandleMove from "../dispatch/updateGameState";
import Highlight from "../piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";
// import { url } from "inspector";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<boardData_Type>({
    BoardLayout: initialPosition,
    turn: "w",
    movesPlayed: { current: -1, moves: [] },
    iscastle: { b: { King: true, rightRook: true, leftRook: true }, w: { King: true, rightRook: true, leftRook: true } },
  });
  const [SelectedMoves, setSelectedMoves] = useState<HintsProps>({ isShowHint: true, availableMoves: [] });
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, row: 0, col: 0 });
  const [ValidMoves, setValidMoves] = useState<moves_Type[][][]>([]);

  useEffect(() => {
    const url = "http://localhost:5000/chess/validmoves";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boardData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setValidMoves(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
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
    } else if (boardData.BoardLayout[row][col] !== "") {
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
