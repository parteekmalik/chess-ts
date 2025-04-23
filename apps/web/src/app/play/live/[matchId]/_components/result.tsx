import type { Color } from "chess.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@acme/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@acme/ui/dialog"; // Adjust the import path as necessary

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";

function Result({
  playerTurn,
  gameDetails,
  status,
}: {
  playerTurn: Color | null;
  gameDetails: { baseTime: number; incrementTime: number } | null;
  status: { isover: boolean; winner: Color | "draw"; reason: string; winnerId?: string } | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { SocketEmiter } = useBackend();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Dialog defaultOpen>
      <DialogContent className="text-background-foreground min-h-[30rem] w-fit min-w-[20rem]">
        <DialogHeader>
          <h1 className="text-xl font-semibold">Result</h1>
        </DialogHeader>
        <div className="mb-auto flex flex-col items-center gap-10 bg-background">
          <div className="flex flex-col items-center gap-5">
            {status?.winner === playerTurn && (
              <div
                className="bg-background-500 aspect-square h-20 w-20 rounded-full"
                style={{ backgroundImage: "https://www.chess.com/bundles/web/images/color-icons/cup.svg", backgroundRepeat: "no-repeat" }}
              />
            )}
            <div className="font-semiBold flex flex-col items-center text-2xl">
              <h1>{status?.winner === "draw" ? "Match Draw" : status?.winnerId === session?.user.id ? "You Won" : "You Lost"}</h1>
              <p className="text-foreground-muted text-tiny">by {status?.reason}</p>
            </div>
          </div>
          <Button
            className="text-xl text-foreground"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              SocketEmiter("find_match", gameDetails, (response: { data?: { matchId: string }; error?: string }) => {
                if (response.data) {
                  router.push(`/play/live/${response.data.matchId}`);
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
