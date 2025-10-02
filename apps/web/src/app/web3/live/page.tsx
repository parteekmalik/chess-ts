"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useFindJoinedMatch, useIsWaitForJoin, useMatchMakingMutation } from "@acme/chess-queries";

import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";
import { MatchesList } from "~/components/solana/cards/MatchesList";
import { ProfilesList } from "~/components/solana/cards/ProfilesList";

export function Web3MatchPage() {
  const router = useRouter();
  const gameMatchMutation = useMatchMakingMutation();
  const { data: watingMatch } = useIsWaitForJoin();
  const { data: liveMatch } = useFindJoinedMatch();
  const createMatch = (baseTime: number, incrementTime: number) => {
    gameMatchMutation.mutate({
      baseTimeSeconds: baseTime / 1000,
      incrementSeconds: incrementTime / 1000,
    });
  };
  useEffect(() => {
    if (liveMatch) router.push(`/web3/live/${liveMatch.address}`);
  }, [liveMatch, router]);

  const matches = <MatchesList showWaiting showActive showFinished colsLength={1} classNames={{ grid: "mx-2", item: "" }} />;
  const players = <ProfilesList classNames={{ grid: "mx-1", item: "max-w-auto" }} colsLength={1} />;
  return (
    <div>
      <BoardWithTime
        isInMatching={gameMatchMutation.isPending || !!watingMatch}
        sideBar={{ createMatch, matches, players }}
        layout={{ boardHeightOffset: 50 }}
      />
    </div>
  );
}

export default Web3MatchPage;
