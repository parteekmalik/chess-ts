import Image from "next/image";

import { MatchResult } from "@acme/anchor";
import { Button } from "@acme/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@acme/ui/dialog"; // Adjust the import path as necessary

import { useBoard } from "../contexts/Board/BoardContextComponent";

function Result() {
  const { gameData, sideBar, isInMatching } = useBoard();

  if (!gameData?.iAmPlayer || gameData.result === MatchResult.Pending) return null;
  const isIWin = gameData.result === (gameData.iAmPlayer === "w" ? MatchResult.WhiteWin : MatchResult.BlackWin);
  const isAbandoned = gameData.result === MatchResult.Abandoned;
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
            {isIWin && (
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
              <h1>{gameData.result === MatchResult.Draw ? "Match Draw" : isAbandoned ? "Match was Abandoned" : isIWin ? "You Won" : "You Lost"}</h1>
              {/* <p className="text-foreground-muted text-tiny">by {match?.stats?.reason}</p> */}
            </div>
          </div>
          <Button
            className="text-xl text-white"
            disabled={isInMatching}
            onClick={() => sideBar?.createMatch?.(gameData.baseTime, gameData.incrementTime)}
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Result;
