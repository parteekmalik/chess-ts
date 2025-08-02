import type { Color } from "chess.js";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { Button } from "@acme/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@acme/ui/dialog"; // Adjust the import path as necessary

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { useTRPC } from "~/trpc/react";

function Result({ playerTurn, matchId }: { playerTurn: Color | null; matchId: string }) {
  const trpc = useTRPC();
  const { data: match } = useQuery(trpc.puzzle.getMatch.queryOptions(matchId));
  const gameDetails = { baseTime: match?.baseTime, incrementTime: match?.incrementTime };

  const [isLoading, setIsLoading] = useState(false);
  const { SocketEmiter } = useBackend();
  const router = useRouter();
  const { data: session } = useSession();

  const winnerId = match?.[match.stats?.winner === "BLACK" ? "blackPlayerId" : "whitePlayerId"];

  return (
    <Dialog defaultOpen>
      <DialogContent className="min-h-[30rem] w-fit min-w-[20rem] dark:text-white">
        <DialogHeader>
          <h1 className="text-xl font-semibold">Result</h1>
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
              setIsLoading(true);
              SocketEmiter("find_match", gameDetails, (response: { data?: NOTIFICATION_PAYLOAD; error?: string }) => {
                console.log("find match -> ", response);
                if (response.data) {
                  router.push(`/play/live/${response.data.id}`);
                }
                setIsLoading(false);
              });
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
