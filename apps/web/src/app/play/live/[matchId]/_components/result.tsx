import type { Color } from "chess.js";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Button } from "@acme/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@acme/ui/dialog"; // Adjust the import path as necessary

import { useTRPC } from "~/trpc/react";
import { useFindMatch } from "./hooks/useFindMatch";

function Result({ playerTurn, matchId }: { playerTurn: Color | null; matchId: string }) {
  const trpc = useTRPC();
  const { data: match } = useQuery(trpc.liveGame.getMatch.queryOptions(matchId));

  const { data: session } = useSession();
  const { findMatchViaSocket, isLoading } = useFindMatch();

  const winnerId = match?.[match.stats?.winner === "BLACK" ? "blackPlayerId" : "whitePlayerId"];

  return (
    <Dialog defaultOpen>
      <DialogContent classNames={{ overlay: "bg-transparent" }} className="min-h-[30rem] w-fit min-w-[20rem] dark:text-white">
        <DialogHeader>
          <DialogTitle>
            <div className="text-xl font-semibold">Result</div>
          </DialogTitle>
        </DialogHeader>
        <div className="mb-auto flex flex-col items-center gap-10 bg-background">
          <div className="relative flex flex-col items-center gap-5">
            {match?.stats?.winner === (playerTurn === "w" ? "WHITE" : "BLACK") && (
              <Image
                src="https://www.chess.com/bundles/web/images/color-icons/cup.svg"
                alt="Cup Icon"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
                unoptimized
              />
            )}
            <div className="font-semiBold flex flex-col items-center text-2xl">
              <h1>{match?.stats?.winner === "DRAW" ? "Match Draw" : winnerId === session?.user.id ? "You Won" : "You Lost"}</h1>
              <p className="text-foreground-muted text-tiny">by {match?.stats?.reason}</p>
            </div>
          </div>
          <Button
            className="text-xl text-white"
            disabled={isLoading}
            onClick={() => {
              if (match) findMatchViaSocket(match.baseTime, match.incrementTime);
            }}
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Result;
