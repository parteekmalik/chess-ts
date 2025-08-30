"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Chess } from "chess.js";

import type { ChessMoveType } from "@acme/lib";
import { cn } from "@acme/ui";
import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Dialog, DialogContent } from "@acme/ui/dialog";

import { ChessBoardWrapper } from "~/components/board/board";
import { BoardProvider } from "~/components/contexts/Board/BoardContextComponent";
import usePuzzle from "~/components/Puzzle/usePuzzle";

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
    <BoardProvider gameState={gameState} initalFlip={gameState.turn()} handleMove={handleMove}>
      <div className="flex h-full w-full flex-col p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <ChessBoardWrapper />
          <Card className="grow gap-5 overflow-hidden bg-background p-0 text-foreground lg:max-w-[540px]">
            <CardHeader className="flex h-fit w-full flex-col items-center bg-primary">
              <h1 className={cn("rounded-lg p-2 px-4 text-3xl font-semibold", gameState.turn() === "w" ? "text-white" : "text-black")}>
                {gameState.turn() === "w" ? "White" : "Black"} to play
              </h1>
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative h-10 w-10 overflow-hidden rounded-sm">
                    {3 - PuzzleState.livesLeft > index ? (
                      <Image
                        src="https://www.chess.com/bundles/web/images/svg/wrong.svg"
                        alt="Wrong move"
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div key={index} className="h-full w-full bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
              <h1 className="bg-forground rounded-lg p-2 px-4 text-3xl font-semibold text-white">
                Score {attempltedPuzzles.reduce((count, puz, index) => count + Number(PuzzleState.passedPuzzleList[index]), 0)}
              </h1>
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-2 p-1 md:p-5">
              {attempltedPuzzles.map((puz, index) => {
                return (
                  <div className="flex flex-col items-center gap-2 rounded-md" key={index}>
                    <Image
                      className={`flex h-[18px] w-[18px] ${PuzzleState.passedPuzzleList[index] ? "text-green" : "text-red"}`}
                      src={`${PuzzleState.passedPuzzleList[index] ? "https://www.chess.com/bundles/web/images/svg/solved.svg" : "https://www.chess.com/bundles/web/images/svg/wrong.svg"}`}
                      height={18}
                      width={18}
                      alt="puzzle status"
                    />
                    <p className="text-white">{puz.rating}</p>
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
      </div>
    </BoardProvider>
  );
}

export default Puzzle;
