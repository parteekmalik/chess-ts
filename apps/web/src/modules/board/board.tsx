"use client";

import type { Chess, Color, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { twMerge } from "tailwind-merge";

import { Button } from "@acme/ui/button";

import type { ChessMoveType } from "./boardMain";
import { checkForValidClick } from "../Utils";
import Coordinates from "./coordinates/coordinates";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import Highlight from "./piece and hints/highlight";

export interface BoardProps {
  handleMove: (move: ChessMoveType) => void;
  initalFlip?: Color;
  gameState: Chess;
}

const ComBoard: React.FC<BoardProps> = ({ handleMove, gameState, initalFlip }) => {
  const [game, setGame] = useState(gameState);
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [flip, setFlip] = useState(gameState.turn());
  const [movesUndone, setMovesUndone] = useState<ChessMoveType[]>([]);
  useEffect(() => {
    setGame(gameState);
    setSelectedPiece(null);
    setMovesUndone([]);
    
    if (initalFlip) setFlip(initalFlip);
    else setFlip(gameState.turn());
  }, [gameState]);

  const playerTurn = game.turn();
  const PieceLogic = (event: React.MouseEvent) => {
    if (movesUndone.length) return;
    const { isValid, square } = checkForValidClick(event, flip);
    if (!isValid) return;
    if (selectedPiece && playerTurn === game.turn() && movesUndone.length === 0) {
      try {
        const move = { from: selectedPiece, to: square };
        try {
          game.move(move);
        } catch {
          game.move({ ...move, promotion: "q" });
        }
        handleMove(game.history()[game.history().length - 1]!);
        setSelectedPiece(null);
      } catch {
        if (game.get(square)) setSelectedPiece(square);
        else setSelectedPiece(null);
      }
    } else if (game.get(square)) setSelectedPiece(square);
  };

  const lastMove = game.history({ verbose: true })[game.history({ verbose: true }).length - 1];

  return (
    <div className="flex">
      <div
        className={twMerge(`relative aspect-square h-[400px] w-[400px] bg-[length:100%_100%] bg-no-repeat`)}
        style={{ backgroundImage: `url('/images/blank_board_img.png')` }}
        onClick={PieceLogic}
      >
        <Coordinates flip={flip} />
        <Highlight selectedPiece={selectedPiece} flip={flip} lastMove={lastMove} />
        <ChessBoard game={flip === "w" ? game.board() : game.board().reverse()} />
        {playerTurn === game.turn() && selectedPiece && !movesUndone.length && (
          <ChessBoardHints game={game} selectedPiece={selectedPiece} flip={flip} />
        )}
      </div>

      <div>
        <div>
          <Button
            onClick={() => {
              setSelectedPiece(null);
              if (game.history().length > 0) {
                const move = game.history()[game.history().length - 1]!;
                setMovesUndone((moves) => [...moves, move]);
                game.undo();
                setGame(_.cloneDeep(game));
              }
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              setSelectedPiece(null);
              if (movesUndone.length) {
                const move = movesUndone.pop()!;
                game.move(move);
                setMovesUndone(movesUndone);
                setGame(_.cloneDeep(game));
              }
            }}
          >
            Next
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setFlip((flip) => (flip === "w" ? "b" : "w"));
            }}
          >
            Flip
          </Button>
        </div>
        <div>
          <div>{JSON.stringify(selectedPiece)}</div>
          <div>{JSON.stringify([game.history(), movesUndone])}</div>
          <div>{JSON.stringify([game.turn(), flip])}</div>
          {/* <pre>{JSON.stringify(lastMove,null,2)}</pre> */}
        </div>
      </div>
    </div>
  );
};

export default ComBoard;
