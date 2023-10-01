// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, checkForValidClick, HintsProps, selectedPieceProps } from "../types";
import ChessBoard from "../piece and hints/ChessBoard";
import ChessBoardHints from "../piece and hints/ChessBoardHints";
import Highlight from "../piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, SQUARES, Square, PieceSymbol } from "chess.js";
import _ from "lodash";

const Board: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
  const [game, setGame] = useState<Chess>(new Chess());
  const [moveundone, setMoveundo] = useState<string[]>([]);

  useEffect(() => {
    if (game.turn() === "b") {
      randomMove();
      setSelectedPiece({ isSelected: false, square: "a0" as Square });
    }
  }, [game.turn()]);

  useEffect(() => {
    console.log(game.history());
  }, [game]);

  const randomMove = () => {
    if (moveundone.length) return;
    const newgame = _.cloneDeep(game);
    if (!newgame.isGameOver()) {
      const moves = newgame.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      newgame.move(move);
      setGame(newgame);
    }
  };
  const handleprev = (event: React.MouseEvent) => {
    const newgame = _.cloneDeep(game);
    if (newgame.history()[newgame.history().length - 1]) setMoveundo([...moveundone, newgame.history()[newgame.history().length - 1]]);
    newgame.undo();
    setGame(newgame);
  };
  const handlenext = (event: React.MouseEvent) => {
    const newgame = _.cloneDeep(game);
    if (moveundone.length) {
      newgame.move(moveundone[moveundone.length - 1]);
      moveundone.pop();
      setMoveundo(moveundone);
    }
    setGame(newgame);
  };

  const clickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);

    if (!isValid) {
      setSelectedPiece({ isSelected: false, square: "a0" as Square });
      return;
    }

    if (selectedPiece.isSelected) {
      if (moveundone.length) return;
      const from = selectedPiece.square;
      const to = SQUARES[row * 8 + col];
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
    setSelectedPiece({ isSelected: false, square: "a0" as Square });

    if (game.board()[row][col]) setSelectedPiece({ isSelected: true, square: SQUARES[row * 8 + col] });
  };

  return (
    <>
      <button onClick={handleprev}>prev</button>
      <button onClick={handlenext}>next</button>
      <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
        <Coordinates />
        <Highlight selectedPiece={selectedPiece} game={game} />
        <ChessBoard BoardLayout={game.board()} />
        <ChessBoardHints selectedPiece={selectedPiece} game={game} />
      </div>
      <div>{}</div>
    </>
  );
};

export default Board;
