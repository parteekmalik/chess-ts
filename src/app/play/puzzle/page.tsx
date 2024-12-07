"use client";
import { Image } from "@nextui-org/react";
import { useEffect, useReducer } from "react";
import Board from "~/modules/board/board";
import { api } from "~/trpc/react";
import { defaultPuzzleContextState, type IPuzzleContextState } from "~/app/play/puzzle/_components/PuzzleContext";
import { type IPuzzleContextActions, PuzzleReducer } from "~/app/play/puzzle/_components/PuzzleReducer";
import { type ChessMoveType } from "~/modules/board/boardMain";

function Puzzle() {
  const [PuzzleState, PuzzleDispatch] = useReducer<React.Reducer<IPuzzleContextState, IPuzzleContextActions>>(
    PuzzleReducer,
    defaultPuzzleContextState,
  );
  const [puzzleList] = api.puzzle.getPuzzles.useSuspenseQuery();

  useEffect(() => {
    if (puzzleList) {
      PuzzleDispatch({ type: "update_puzzle_list", payload: puzzleList });
    }
  }, [puzzleList]);

  useEffect(() => {
    const puzzle = PuzzleState.puzzleList[PuzzleState.puzzleNo];
    const nextMoveN = PuzzleState.movesPlayed.length;
    const nextMove = puzzle?.moves[nextMoveN];
    const iswrong = puzzle?.moves[nextMoveN - 1] !== PuzzleState.movesPlayed[nextMoveN - 1];

    console.log("Puzzlemoves -> ", puzzle?.moves);
    console.log("nextMove -> ", nextMove);
  }, [PuzzleState.movesPlayed]);

  function handleMove(payload: ChessMoveType) {
    console.log("handleMove -> ", payload);
    PuzzleDispatch({ type: "move_piece", payload });
  }

  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex">
        <Board
          puzzleNo={PuzzleState.puzzleNo}
          playerTurn={PuzzleState.playerTurn}
          startingBoard={PuzzleState.puzzleList[PuzzleState.puzzleNo]?.fen}
          movesPlayed={PuzzleState.movesPlayed}
          handleMove={handleMove}
        />
        <div className="flex h-fit grow flex-wrap gap-5 p-5 text-foreground">
          {PuzzleState.puzzleList.map((puz, index) => {
            if (PuzzleState.puzzleNo > index) {
              return (
                <div className="flex flex-col items-center gap-2 rounded-md bg-background-500 p-2" key={index} style={{ width: "60px" }}>
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
      <div className="flex w-[50%] flex-col">
        <h2>Socket IO Information:</h2>
        {Object.entries({ ...PuzzleState, movesPlayed: PuzzleState.movesPlayed }).map(([key, value]) => {
          return !["socket", "game", "puzzleList"].includes(key) ? (
            <div key={key}>
              {key}: {JSON.stringify(value)}
            </div>
          ) : null;
        })}
        {/* <div className="flex w-[500px] flex-wrap gap-5">
          {new Chess(getLastElement(PuzzleState.movesPlayed)?.board_state).moves().map((move, index) => (
            <Button
              className="bg-slate-500 p-2 text-white"
              onPress={() => {
                handleMove(move);
              }}
              key={index}
            >
              {move}
            </Button>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Puzzle;
