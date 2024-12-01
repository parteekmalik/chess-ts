"use client";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { Chess, type Color, DEFAULT_POSITION, type Square } from "chess.js";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { checkForValidClick } from "../Utils";
import type { ChessMoveType } from "./boardMain";
import Coordinates from "./coordinates/coordinates";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import Highlight from "./piece and hints/highlight";

export interface BoardProps {
  handleMove: (move: ChessMoveType) => void;
  startingBoard?: string;
  movesPlayed: ChessMoveType[];
  playerTurn: Color | null;
  puzzleNo?: number;
}

const ComBoard: React.FC<BoardProps> = ({ startingBoard = DEFAULT_POSITION, movesPlayed, handleMove, playerTurn, puzzleNo }) => {
  const [game, setGame] = useState(new Chess(startingBoard));
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setFlip(false);
  }, [puzzleNo]);

  useEffect(() => {
    const game = new Chess(startingBoard);
    movesPlayed.forEach((move) => {
      game.move(move);
    });
    setGame(game);
  }, [startingBoard, movesPlayed]);

  const PieceLogic = (event: React.MouseEvent) => {
    if (game.history().length !== movesPlayed.length) return;
    const { isValid, square } = checkForValidClick(event, playerTurn ? (flip ? oppositeTurn(playerTurn) : playerTurn) : "w");
    console.log("playerTurn -> ", playerTurn);
    console.log("isValid -> ", isValid, " square -> ", square);
    if (!isValid) return;
    if (selectedPiece && playerTurn === game.turn()) {
      try {
        game.move({ from: selectedPiece, to: square! });
        handleMove({ from: selectedPiece, to: square! });
        setSelectedPiece(null);
      } catch {
        console.log("invalid move from board component -> ", selectedPiece, " to -> ", square);
        console.log("game.get(square as Square) -> ", game.get(square!));
        if (game.get(square!)) setSelectedPiece(square!);
        else setSelectedPiece(null);
      }
    } else if (game.get(square!)) setSelectedPiece(square!);
  };

  function oppositeTurn(turn: Color) {
    return turn === "w" ? "b" : "w";
  }
  return (
    <div className="flex grow">
      <div
        className={twMerge(`relative h-[400px] w-[400px] aspect-square bg-[length:100%_100%] bg-no-repeat`)}
        style={{ backgroundImage: `url('/images/blank_board_img.png')` }}
        onClick={PieceLogic}
      >
        <Coordinates flip={playerTurn ? (flip ? oppositeTurn(playerTurn) : playerTurn) : "w"} />
        <Highlight
          selectedPiece={selectedPiece}
          flip={playerTurn ? (flip ? oppositeTurn(playerTurn) : playerTurn) : "w"}
          lastMove={game.history({ verbose: true })[game.history({ verbose: true }).length - 1]}
        />
        <ChessBoard game={playerTurn === "b" ? (flip ? game.board() : game.board().reverse()) : flip ? game.board().reverse() : game.board()} />
        {playerTurn === game.turn() && selectedPiece && (
          <ChessBoardHints game={game} selectedPiece={selectedPiece} flip={playerTurn ? (flip ? oppositeTurn(playerTurn) : playerTurn) : "w"} />
        )}
      </div>

      <Accordion variant="splitted" >
        <AccordionItem key="1" aria-label="SETTING" title="SETTING" className="flex flex-col gap-2">
          <div>
            <Button
              onPress={() => {
                setSelectedPiece(null);
                const newgame = _.cloneDeep(game);
                if (newgame.history().length > 0) {
                  newgame.undo();
                  setGame(newgame);
                }
              }}
            >
              Back
            </Button>
            <Button
              onPress={() => {
                setSelectedPiece(null);
                const newgame = _.cloneDeep(game);
                if (newgame.history().length < movesPlayed.length) {
                  newgame.move(movesPlayed[newgame.history().length]!);
                  setGame(newgame);
                }
              }}
            >
              Next
            </Button>
          </div>
          <div>
            <Button
              onPress={() => {
                setFlip(!flip);
              }}
            >
              Flip
            </Button>
          </div>
        </AccordionItem>
        <AccordionItem key="2" aria-label="DEBUG" title="DEBUG">
          <div>{JSON.stringify(selectedPiece)}</div>
          <div>{JSON.stringify(game.history())}</div>
          <div>{JSON.stringify(game.turn())}</div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ComBoard;
