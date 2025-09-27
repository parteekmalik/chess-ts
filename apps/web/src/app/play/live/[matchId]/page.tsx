"use client";

import type { Color } from "chess.js";
import React from "react";
import { useParams } from "next/navigation";
import { BLACK, WHITE } from "chess.js";
import { useSession } from "next-auth/react";

import type { Match, MatchResult, MatchWinner, Move } from "@acme/db";
import { MatchStatus, MatchResult as Web3MatchResult } from "@acme/anchor";

import type { GameData } from "~/components/contexts/Board/BoardContextComponent";
import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";
import { useFindMatch } from "~/components/LiveMatch/hooks/useFindMatch";
import { useLiveGame } from "~/components/LiveMatch/hooks/useLiveGame";

const LiveBoard: React.FunctionComponent = () => {
  const params = useParams();
  const { match, isLoading, handleMove, reload } = useLiveGame(params.matchId as string | undefined);
  const { data: session } = useSession();
  const { findMatchViaSocket, isLoading: isInMatching } = useFindMatch();

  if (isLoading) return <div>Loading...</div>;
  if (!match) return <div>Match not found</div>;

  const iAmPlayer: Color | undefined =
    match.whitePlayerId === session?.user.id ? WHITE : match.blackPlayerId === session?.user.id ? BLACK : undefined;
  const gameData = { ...convertMatchToGameData(match), iAmPlayer };

  const createMatch = (baseTime: number, incrementTime: number) => {
    findMatchViaSocket(baseTime, incrementTime);
  };

  return (
    <div className="text-background-foreground flex w-full flex-col">
      <BoardWithTime
        isInMatching={isInMatching}
        sideBar={{ createMatch }}
        reload={reload}
        gameData={gameData}
        whitePlayerData={{ id: match.whitePlayerId }}
        blackPlayerData={{ id: match.blackPlayerId }}
        handleMove={handleMove}
      />
    </div>
  );
};

export default LiveBoard;

const convertMatchToGameData = (match: Match & { moves: Move[]; stats: MatchResult }): GameData => {
  return {
    moves: match.moves.map((move) => ({ san: move.move, ts: move.timestamp })),
    startedAt: match.startedAt,
    baseTime: match.baseTime,
    incrementTime: match.incrementTime,
    status: match.stats.winner === "PLAYING" ? MatchStatus.Active : MatchStatus.Finished,
    result: convertResult(match.stats.winner),
  };
};
function convertResult(result: MatchWinner): Web3MatchResult {
  switch (result) {
    case "PLAYING":
      return Web3MatchResult.Pending;
    case "WHITE":
      return Web3MatchResult.WhiteWin;
    case "BLACK":
      return Web3MatchResult.BlackWin;
    case "DRAW":
      return Web3MatchResult.Draw;
  }
}
