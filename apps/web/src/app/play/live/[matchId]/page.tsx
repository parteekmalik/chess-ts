"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { BoardWithTime } from "./_components/BoardWithTime";
import { useLiveGame } from "./_components/hooks/useLiveGame";
import Result from "./_components/result";

const LiveBoard: React.FunctionComponent = () => {
  const params = useParams();
  const { match, isLoading, gameState, playerTimes, handleMove, openResult, reload } = useLiveGame(params.matchId as string | undefined);
  const { data: session } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (!match) return <div>Match not found</div>;

  const iAmPlayer = match.whitePlayerId === session?.user.id ? "w" : match.blackPlayerId === session?.user.id ? "b" : null;

  return (
    <div className="text-background-foreground flex w-full flex-col">
      <BoardWithTime
        gameState={gameState}
        initalFlip={iAmPlayer ?? "w"}
        turn={match.moves.length % 2 === 0 ? "w" : "b"}
        result={match.stats}
        reload={reload}
        whitePlayerData={{ time: playerTimes.w, id: match.whitePlayerId }}
        blackPlayerData={{ time: playerTimes.b, id: match.blackPlayerId }}
        handleMove={handleMove}
      />
      {openResult && <Result playerTurn={iAmPlayer} matchId={params.matchId as string} />}
    </div>
  );
};

export default LiveBoard;
