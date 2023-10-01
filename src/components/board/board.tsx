// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, checkForValidClick, HintsProps, selectedPieceProps } from "../types";
import ChessBoard from "../piece and hints/ChessBoard";
import ChessBoardHints from "../piece and hints/ChessBoardHints";
// import Highlight from "../piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, SQUARES, Square, PieceSymbol } from "chess.js";
import _ from "lodash";

const Board: React.FC = () => {
  const [SelectedMoves, setSelectedMoves] = useState<HintsProps>({ isShowHint: true, availableMoves: [] });
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, row: 0, col: 0 });

  const [game, setGame] = useState(new Chess());
  const [moveundo, setMoveundo] = useState<string[]>([]);

  useEffect(() => {
    if (game.turn() === "b") randomMove();
  }, [game.turn()]);

  const randomMove = () => {
    if (moveundo.length) return;
    const newgame = _.cloneDeep(game);
    if (!newgame.isGameOver()) {
      const moves = newgame.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      console.log(moves);
      newgame.move(move);
      setGame(newgame);
    }
  };
  const handleprev = (event: React.MouseEvent) => {
    const newgame = _.cloneDeep(game);
    if (newgame.history()[newgame.history().length - 1]) setMoveundo([...moveundo, newgame.history()[newgame.history().length - 1]]);
    newgame.undo();
    setGame(newgame);
  };
  const handlenext = (event: React.MouseEvent) => {
    const newgame = _.cloneDeep(game);
    if (moveundo.length) {
      newgame.move(moveundo[moveundo.length - 1]);
      moveundo.pop();
      setMoveundo(moveundo);
    }
    setGame(newgame);
  };

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, row: 0, col: 0 });
      return;
    }

    if (selectedPiece.isSelected) {
      const from = SQUARES[selectedPiece.row * 8 + selectedPiece.col] as string;
      const to = SQUARES[row * 8 + col] as string;
      console.log("from->", from, "to ->", to);
      const newGame = _.cloneDeep(game);

      try {
        newGame.move({ from, to });
        setGame(newGame);
      } catch {
        try {
          newGame.move({ from, to, promotion: "q" as PieceSymbol });
          setGame(newGame);
        } catch {
          console.log("invalid move");
        }
      }
    }
    setSelectedPiece({ isSelected: false, row: 0, col: 0 });
    setSelectedMoves({ ...SelectedMoves, availableMoves: [] });

    if (game.board()[row][col]) {
      setSelectedPiece({ isSelected: true, row, col });
      setSelectedMoves({
        ...SelectedMoves,
        availableMoves: game
          .moves({ verbose: true, square: SQUARES[row * 8 + col] })
          .map((move) => ({ from: move.from as Square, to: move.to as Square, promotion: move.promotion })),
      });
    }
  };

  return (
    <>
      <button onClick={handleprev}>prev</button>
      <button onClick={handlenext}>next</button>
      <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
        <Coordinates />
        {/* <Highlight selectedPiece={selectedPiece} movesPlayed={boardData.movesPlayed} /> */}
        <ChessBoard BoardLayout={game.board()} />
        <ChessBoardHints Hints={SelectedMoves.availableMoves} BoardLayout={game.board()} />
      </div>
      <div>{}</div>
    </>
  );
};

export default Board;
