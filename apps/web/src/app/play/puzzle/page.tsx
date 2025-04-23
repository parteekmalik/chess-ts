"use client";

import { useMemo } from "react";
import { Image } from "@nextui-org/react";
import { Chess } from "chess.js";

import type { ChessMoveType } from "~/modules/board/boardMain";
import { env } from "~/env";
import Board from "~/modules/board/board";
import usePuzzle from "./_components/usePuzzle";

function Puzzle() {
  const { PuzzleDispatch, PuzzleState } = usePuzzle();

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

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex">
        <Board gameState={gameState} handleMove={handleMove} className="" />
        <div className="flex h-fit grow flex-wrap gap-5 p-5 text-foreground">
          {PuzzleState.puzzleList.map((puz, index) => {
            if (PuzzleState.puzzleNo > index) {
              return (
                <div className="bg-background-500 flex flex-col items-center gap-2 rounded-md p-2" key={index} style={{ width: "60px" }}>
                  <Image
                    className={`flex h-[18px] w-[18px] text-[${PuzzleState.passedPuzzleList[index] ? "green" : "red"}]`}
                    src={`${PuzzleState.passedPuzzleList[index] ? "https://www.chess.com/bundles/web/images/svg/solved.svg" : "https://www.chess.com/bundles/web/images/svg/wrong.svg"}`}
                    alt="puzzle status"
                  ></Image>
                  <p>{puz.rating}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
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
