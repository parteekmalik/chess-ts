"use client";

import type { Color, Square } from "chess.js";
import type { PropsWithChildren, ReactNode } from "react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import _ from "lodash";

import type { MatchResult, MatchStatus } from "@acme/anchor";
import type { MatchMove } from "@acme/chess-queries";
import type { ChessMoveType } from "@acme/lib";

import { checkForValidClick } from "~/components/Utils";

export interface GameData {
  startedAt: Date;
  baseTime: number;
  incrementTime: number;
  moves: MatchMove[];
  status: MatchStatus;
  result: MatchResult;
  iAmPlayer?: Color;
  gameState?: Chess;
}

export interface SideBar {
  createMatch?: (baseTime: number, incrementTime: number) => void;
  matches?: ReactNode;
  players?: ReactNode;
}

export interface Layout {
  boardHeightOffset?: number;
}
export interface BoardContextProps {
  reload?: () => void;
  handleMove?: (move: ChessMoveType) => void;
  layout?: Layout;
  isInMatching: boolean;
  gameData?: GameData;
  sideBar?: SideBar;
}

function useBoardContextLogic(props: BoardContextProps) {
  const { handleMove } = props;
  const initalFlip = useMemo(() => props.gameData?.iAmPlayer ?? "w", [props.gameData?.iAmPlayer]);
  const gameState = useMemo(() => {
    const game = props.gameData?.gameState ?? new Chess();
    props.gameData?.moves.forEach((mv) => game.move(mv.san));
    return game;
  }, [props.gameData]);
  const [game, setGame] = useState(gameState);
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [flip, setFlip] = useState(initalFlip);
  const [movesUndone, setMovesUndone] = useState<ChessMoveType[]>([]);
  const playerTurn = game.turn();
  const lastMove = game.history({ verbose: true })[game.history({ verbose: true }).length - 1];

  useEffect(() => {
    if (props.gameData?.iAmPlayer) setFlip(props.gameData.iAmPlayer);
  }, [props.gameData?.iAmPlayer]);
  useEffect(() => {
    setGame(gameState);
    setSelectedPiece(null);
    setMovesUndone([]);
  }, [gameState]);
  const PieceLogic = (event: React.MouseEvent) => {
    if (movesUndone.length) return;
    const { isValid, square } = checkForValidClick(event, flip);
    if (!isValid || !handleMove) return;
    if (square === selectedPiece) {
      setSelectedPiece(null);
      return;
    }
    if (selectedPiece && props.gameData?.iAmPlayer === game.turn() && movesUndone.length === 0) {
      try {
        const move = { from: selectedPiece, to: square };
        const new_game = _.cloneDeep(game);
        try {
          new_game.move(move);
        } catch {
          new_game.move({ ...move, promotion: "q" });
        }
        const lastMove = new_game.history()[new_game.history().length - 1]!;
        setGame(new_game);
        handleMove(lastMove);
        setSelectedPiece(null);
      } catch {
        if (game.get(square)) setSelectedPiece(square);
        else setSelectedPiece(null);
      }
    } else {
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
    ...props,
    initalFlip,
    playerTurn,
    PieceLogic,
    lastMove,
    flip,
    game,
    selectedPiece,
    movesUndone,
    reloadGame: () => {
      reloadGame();
      setGame(_.cloneDeep(gameState));
    },
    boardFunctions: { doMove, undoMove, setFlip, gotoMove, goEnd, goStart },
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
