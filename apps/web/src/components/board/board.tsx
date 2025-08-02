"use client";

import type { Chess, Color, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { twMerge } from "tailwind-merge";

import { cn } from "@acme/ui";

import type { ChessMoveType } from "./boardMain";
import { env } from "~/env";
import { checkForValidClick } from "../Utils";
import { BoardSettings } from "./BoardSettings";
import Coordinates from "./coordinates/coordinates";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import Highlight from "./piece and hints/highlight";

export interface BoardProps {
  handleMove?: (move: ChessMoveType) => void;
  initalFlip?: Color;
  className?: string;
  blackBar?: React.ReactNode;
  whiteBar?: React.ReactNode;
  gameState: Chess;
}

export const ChessBoardWrapper: React.FC<BoardProps> = ({ handleMove, gameState, initalFlip, whiteBar, blackBar, className }) => {
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
    if (!isValid || !handleMove) return;
    console.log("valid", square, game.get(square), initalFlip);
    if (selectedPiece && initalFlip === game.turn() && movesUndone.length === 0) {
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
    } else if (initalFlip && game.get(square)?.color === initalFlip) {
      console.log(square, game.get(square), initalFlip);
      setSelectedPiece(square);
    }
  };
  const doMove = () => {
    setSelectedPiece(null);
    if (movesUndone.length) {
      const move = movesUndone.pop()!;
      game.move(move);
      setMovesUndone(movesUndone);
      setGame(_.cloneDeep(game));
    }
  };
  const undoMove = () => {
    setSelectedPiece(null);
    if (game.history().length > 0) {
      const move = game.history()[game.history().length - 1]!;
      setMovesUndone((moves) => [...moves, move]);
      game.undo();
      setGame(_.cloneDeep(game));
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") undoMove();
      else if (event.key === "ArrowRight") doMove();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [game, movesUndone]);

  const lastMove = game.history({ verbose: true })[game.history({ verbose: true }).length - 1];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {flip === "w" ? blackBar : whiteBar}
      <div
        className={twMerge(`relative aspect-square w-full lg:h-[70vh]`)}
        style={{
          backgroundImage: `url('/images/blank_board_img.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
        onClick={PieceLogic}
      >
        <Coordinates flip={flip} />
        <Highlight selectedPiece={selectedPiece} flip={flip} lastMove={lastMove} />
        <ChessBoard game={flip === "w" ? game.board() : game.board().reverse()} />
        {playerTurn === game.turn() && selectedPiece && !movesUndone.length && (
          <ChessBoardHints game={game} selectedPiece={selectedPiece} flip={flip} />
        )}
      </div>
      {flip === "w" ? whiteBar : blackBar}
      <BoardSettings setFlip={setFlip} undoMove={undoMove} doMove={doMove} />
      {env.NODE_ENV === "development" && (
        <details>
          <summary className="text-white hover:cursor-pointer">Debug Information</summary>
          <pre>
            <code className="json text-white">
              {JSON.stringify(
                {
                  selectedPiece,
                  moves: {
                    History: game.history(),
                    movesUndone,
                  },
                  TurnandFlip: {
                    CurrentTurn: game.turn(),
                    BoardOrientation: flip,
                  },
                  // "Last Move": lastMove, // Uncomment if needed
                },
                null,
                2,
              )}
            </code>
          </pre>
        </details>
      )}
    </div>
  );
};
