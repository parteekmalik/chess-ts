import type { Chess, Color, Square } from "chess.js";
import type { PropsWithChildren } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import _ from "lodash";

import type { MatchResult } from "@acme/db";
import type { ChessMoveType } from "@acme/lib";

import { checkForValidClick } from "~/components/Utils";

export interface BoardContextProps {
  result?: MatchResult | null;
  reload?: () => void;
  gameState: Chess;
  handleMove?: (move: ChessMoveType) => void;
  initalFlip?: Color;
}

function useBoardContextLogic(props: BoardContextProps) {
  const { gameState, handleMove, initalFlip } = props;
  const [game, setGame] = useState(gameState);
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [flip, setFlip] = useState(gameState.turn());
  const [movesUndone, setMovesUndone] = useState<ChessMoveType[]>([]);
  const playerTurn = game.turn();
  const lastMove = game.history({ verbose: true })[game.history({ verbose: true }).length - 1];

  useEffect(() => {
    setGame(gameState);
    setSelectedPiece(null);
    setMovesUndone([]);

    if (initalFlip) setFlip(initalFlip);
    else setFlip(gameState.turn());
  }, [gameState]);
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
    gotoMove(game.history().length);
  };
  const undoMove = () => {
    setSelectedPiece(null);
    gotoMove(game.history().length - 2);
  };
  const goEnd = () => {
    setSelectedPiece(null);
    gotoMove(gameState.history().length - 1);
  };
  const goStart = () => {
    setSelectedPiece(null);
    gotoMove(-1);
  };
  const gotoMove = (i: number) => {
    setSelectedPiece(null);
    const totalMoves = gameState.history().length;
    if (i < -1 || i >= totalMoves) return;

    const newGame = _.cloneDeep(gameState);
    let idx = i;
    while (idx !== totalMoves - 1) {
      newGame.undo();
      idx++;
    }
    setMovesUndone(gameState.history().slice(i + 1, totalMoves));
    setGame(newGame);
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

  const reloadGame = () => props.reload?.();

  return {
    reloadGame: () => {
      reloadGame();
      setGame(_.cloneDeep(gameState));
    },
    playerTurn,
    PieceLogic,
    lastMove,
    flip,
    game,
    selectedPiece,
    movesUndone,
    boardFunctions: { doMove, undoMove, setFlip, gotoMove, goEnd, goStart },
    result: props.result,
  };
}

type BoardContextValue = ReturnType<typeof useBoardContextLogic>;

const BoardContext = createContext<BoardContextValue | undefined>(undefined);

export const BoardProvider: React.FC<PropsWithChildren<BoardContextProps>> = (props) => {
  const contextValue = useBoardContextLogic(props);
  return <BoardContext.Provider value={contextValue}>{props.children}</BoardContext.Provider>;
};

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoard must be used within a <BoardProvider>");
  }
  return ctx;
}
