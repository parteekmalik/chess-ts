"use client";

import type { Color } from "chess.js";
import { BLACK, WHITE } from "chess.js";
import type { Address } from "gill";
import { address } from "gill";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  useChessMatch,
  useConnectedWalletProfile,
  useFindJoinedMatch,
  useIsWaitForJoin,
  useMakeMoveMutation,
  useMatchMakingMutation
} from "@acme/chess-queries";
import type { ChessMoveType } from "@acme/lib";

import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";
import { MatchesList } from "~/components/solana/cards/MatchesList";
import { ProfilesList } from "~/components/solana/cards/ProfilesList";

export function useIsPlayerInMatch(matchAddress: Address): Color | undefined {
  const { data: profile } = useConnectedWalletProfile();
  const { data: match } = useChessMatch(matchAddress);
  if (match?.white === profile?.address) return WHITE;
  else if (match?.black === profile?.address) return BLACK;
  else return undefined;
}

export function Web3MatchPage() {
  const params = useParams();
  const matchAddress = address(params.matchAddress as string);
  const { data: match } = useChessMatch(matchAddress);
  const iAmPlayer = useIsPlayerInMatch(matchAddress);
  const makeMoveMutation = useMakeMoveMutation();
  const gameMatchMutation = useMatchMakingMutation();
  const { data: watingMatch } = useIsWaitForJoin();

  const gameData = useMemo(
    () =>
      match
        ? {
            moves: match.moves,
            startedAt: match.matchedAt!,
            baseTime: match.baseTimeSeconds * 1000,
            incrementTime: match.incrementSeconds * 1000,
            status: match.status,
            result: match.result,
            iAmPlayer,
          }
        : null,
    [match, iAmPlayer],
  );

  const router = useRouter();
  const { data: liveMatch } = useFindJoinedMatch();
  useEffect(() => {
    if (liveMatch) router.push(`/web3/live/${liveMatch.address}`);
  }, [liveMatch, router]);

  if (!match || !gameData) return <div>Match not found</div>;
  const handleMove = (move: ChessMoveType) => {
    if (typeof move === "object") {
      console.error("only san is acceped");
    } else {
      makeMoveMutation.mutate({
        matchId: match.matchId,
        move,
      });
    }
  };

  const createMatch = (baseTime: number, incrementTime: number) => {
    gameMatchMutation.mutate({
      baseTimeSeconds: baseTime / 1000,
      incrementSeconds: incrementTime / 1000,
    });
  };
  const matches = <MatchesList showWaiting showActive showFinished colsLength={1} classNames={{ grid: "mx-2", item: "" }} />;
  const players = <ProfilesList classNames={{ grid: "mx-1", item: "max-w-auto" }} colsLength={1} />;
  return (
    <div>
      <BoardWithTime
        isInMatching={gameMatchMutation.isPending || !!watingMatch}
        gameData={gameData}
        sideBar={{
          createMatch,
          matches,
          players,
        }}
        layout={{ boardHeightOffset: 50 }}
        handleMove={handleMove}
      />
    </div>
  );
}

export default Web3MatchPage;
