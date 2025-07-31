"use client";

import React from "react";
import { useSession } from "next-auth/react";

import { env } from "~/env";
import { BoardWithTime } from "./_components/BoardWithTime";
import { useLiveGame } from "./_components/hooks/useLiveGame";
import Result from "./_components/result";

const LiveBoard: React.FunctionComponent = () => {
  const { match, isLoading, gameState, playerTimes, handleMove, openResult, params } = useLiveGame();
  const { data: session } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (!match) return <div>Match not found</div>;

  const iAmPlayer = match.whitePlayerId === session?.user.id ? "w" : match.blackPlayerId === session?.user.id ? "b" : null;

  return (
    <div className="text-background-foreground flex w-full flex-col">
      <BoardWithTime
        disabled
        gameState={gameState}
        initalFlip={iAmPlayer ?? "w"}
        isWhiteTurn={match.moves.length % 2 === 0}
        whitePlayerData={{ time: playerTimes.w, id: match.whitePlayerId }}
        blackPlayerData={{ time: playerTimes.b, id: match.blackPlayerId }}
        handleMove={handleMove}
      />
      {openResult && <Result playerTurn={iAmPlayer} matchId={params.matchId as string} />}

      {env.NODE_ENV === "development" && (
        <details className="flex w-[50%] flex-col">
          <summary className="hover:cursor-pointer">Socket IO Information:</summary>
          <pre>
            <div className="flex flex-col">
              <pre>{JSON.stringify([iAmPlayer, match.stats])}</pre>
              <div>{JSON.stringify(params)}</div>
              <div className="flex flex-col gap-2">
                <span>Player Turn: {iAmPlayer}</span>
                <span>White Time: {playerTimes.w}</span>
                <span>Black Time: {playerTimes.b}</span>
              </div>
            </div>
          </pre>
        </details>
      )}
    </div>
  );
};

export default LiveBoard;
