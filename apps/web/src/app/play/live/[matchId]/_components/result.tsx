import type { Color } from "chess.js";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay } from "@acme/ui/dialog"; // Adjust the import path as necessary

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";

function Result({
  playerTurn,
  gameDetails,
  status,
}: {
  playerTurn: Color | null;
  gameDetails: { baseTime: number; incrementTime: number } | null;
  status: { isover: boolean; winner: Color | "draw"; reason: string } | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { SocketEmiter } = useBackend();
  const router = useRouter();

  return (
    <>
      <Dialog defaultOpen>
        <DialogOverlay />
        <DialogContent className="text-background-foreground w-fit">
          <DialogHeader className="bg-background-600 flex flex-row items-center justify-center gap-4 pr-10">
            {status?.winner === playerTurn && (
              <Image className="aspect-square w-10" src="https://www.chess.com/bundles/web/images/color-icons/cup.svg" alt="trophy" />
            )}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">{status?.winner === playerTurn ? "You Won!" : status?.winner === "draw" ? "Draw!" : "You Lost!"}</h1>
              <p className="text-foreground-muted text-tiny">by {status?.reason}</p>
            </div>
          </DialogHeader>
          <DialogContent className="flex flex-col items-center justify-center bg-background">
            <div>Result</div>
            <Button
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
          </DialogContent>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Result;
