"use client";

import type { Address } from "gill";
import { useParams } from "next/navigation";
import { BLACK, WHITE } from "chess.js";
import { address } from "gill";

import type { ChessMoveType } from "@acme/lib";
import { useChessMatch, useConnectedWalletProfile, useCreateChessMatchMutation, useMakeMoveMutation, useWaitForJoin } from "@acme/chess-queries";

import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";
import { MatchesList } from "~/components/solana/cards/MatchesList";
import { ProfilesList } from "~/components/solana/cards/ProfilesList";

export function useIsPlayerInMatch(matchAddress: Address) {
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
  const createMatchMutation = useCreateChessMatchMutation();
  const { data: watingMatch } = useWaitForJoin();

  if (!match) return <div>Match not found</div>;
  const handleMove = (move: ChessMoveType) => {
    if (typeof move === "object") {
      console.error("only san is acceped");
    } else
      makeMoveMutation.mutate({
        matchId: match.matchId,
        move,
      });
  };

  const createMatch = (baseTime: number, incrementTime: number) => {
    createMatchMutation.mutate({
      baseTimeSeconds: baseTime / 1000,
      incrementSeconds: incrementTime / 1000,
    });
  };
  const matches = <MatchesList showWaiting showActive colsLength={1} />;
  const players = <ProfilesList colsLength={1} />;
  return (
    <div>
      <BoardWithTime
        isInMatching={createMatchMutation.isPending || !!watingMatch}
        gameData={{
          moves: match.moves,
          startedAt: match.matchedAt!,
          baseTime: match.baseTimeSeconds * 1000,
          incrementTime: match.incrementSeconds * 1000,
          status: match.status,
          result: match.result,
          iAmPlayer,
        }}
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
