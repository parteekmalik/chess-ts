"use client";

import { useMemo } from "react";
import { Chess } from "chess.js";

import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Dialog, DialogContent } from "@acme/ui/dialog";

import type { ChessMoveType } from "~/components/board/boardMain";
import Board from "~/components/board/board";
import { env } from "~/env";
import usePuzzle from "./_components/usePuzzle";

function Puzzle() {
  const { PuzzleDispatch, PuzzleState, reset } = usePuzzle();

  function handleMove(payload: ChessMoveType) {
    console.log("handleMove -> ", payload);
    PuzzleDispatch({ type: "move_piece", payload });
  }
  const gameState = useMemo(() => {
    const game = new Chess(PuzzleState.puzzleList[PuzzleState.puzzleNo]?.fen);
    PuzzleState.movesPlayed.forEach((move) => {
      game.move(move);
    });
    return game;
  }, [PuzzleState]);

  const attempltedPuzzles = PuzzleState.puzzleList.slice(0, PuzzleState.puzzleNo);

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex gap-2">
        <Board gameState={gameState} initalFlip={gameState.turn()} handleMove={handleMove} className="" />
        <Card className="grow gap-5 overflow-hidden p-0 text-foreground">
          <CardHeader className="flex h-fit w-full flex-col items-center bg-primary">
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <div className="h-10 w-10 overflow-hidden rounded-sm">
                  {3 - PuzzleState.livesLeft > index ? (
                    <img key={index} className="h-full w-full" src="https://www.chess.com/bundles/web/images/svg/wrong.svg" alt="" />
                  ) : (
                    <div key={index} className="h-full w-full bg-slate-600"></div>
                  )}
                </div>
              ))}
            </div>
            <h1 className="rounded-lg bg-slate-600 p-2 px-4 text-3xl font-semibold">
              Score {attempltedPuzzles.reduce((count, puz, index) => count + Number(PuzzleState.passedPuzzleList[index]), 0)}
            </h1>
          </CardHeader>
          <CardContent className="flex p-5">
            {attempltedPuzzles.map((puz, index) => {
              return (
                <div className="bg-background-500 flex flex-col items-center gap-2 rounded-md p-2" key={index} style={{ width: "60px" }}>
                  <img
                    className={`flex h-[18px] w-[18px] text-[${PuzzleState.passedPuzzleList[index] ? "green" : "red"}]`}
                    src={`${PuzzleState.passedPuzzleList[index] ? "https://www.chess.com/bundles/web/images/svg/solved.svg" : "https://www.chess.com/bundles/web/images/svg/wrong.svg"}`}
                    alt="puzzle status"
                  />
                  <p>{puz.rating}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      {PuzzleState.livesLeft <= 0 && (
        <Dialog defaultOpen onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <div className="flex h-full w-full flex-col items-center justify-center gap-5">
              <h1 className="text-3xl font-bold">Game Over</h1>
              <h2 className="text-2xl font-semibold">
                You scored {attempltedPuzzles.reduce((count, puz, index) => count + Number(PuzzleState.passedPuzzleList[index]), 0)} points
              </h2>
              <button className="rounded-md bg-primary p-2 px-4 text-xl font-semibold text-background" onClick={() => reset()}>
                Play Again
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {env.NODE_ENV === "development" && (
        <details className="flex w-[50%] flex-col">
          <summary className="hover:cursor-pointer">Socket IO Information:</summary>
          <pre>
            <code className="json">
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries({ ...PuzzleState, movesPlayed: PuzzleState.movesPlayed }).filter(
                    ([key]) => !["socket", "game", "puzzleList"].includes(key),
                  ),
                ),
                null,
                2,
              )}
            </code>
          </pre>
        </details>
      )}
    </div>
  );
}

export default Puzzle;
