"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import type { Move } from "@acme/db";
import { cn } from "@acme/ui";
import { ScrollArea } from "@acme/ui/scroll-area";

import { useTRPC } from "~/trpc/react";

export function MovesDisplay() {
  const trpc = useTRPC();
  const params = useParams();
  const { data: match } = useQuery(trpc.liveGame.getMatch.queryOptions(params.matchId as string, { enabled: !!params.matchId }));

  if (!match) return null;
  const result = timeCalculateAdvance(match.moves, match.startedAt);
  return (
    <ScrollArea className="h-72 rounded-md border bg-white/5">
      {result.map((move, index) => (
        <div key={index} className={cn("flex h-[30px] w-full items-center px-4 text-sm text-white/75 odd:bg-black/5 even:bg-black/15")}>
          <span className="flex-[0_0_5%] text-muted-foreground">{index + 1}.</span>
          <span className="flex-[0_0_10%]">{move.white && <span>{move.white.move.move}</span>}</span>
          <span className="flex-[0_0_10%]">{move.black && <span>{move.black.move.move}</span>}</span>
          <span className="flex-[0_0_75%]">
            <div className="my-[3px] ml-auto grid h-[30px] grid-cols-12 grid-rows-2 items-end">
              {move.white && <TimeBar timeTaken={move.white.difference} totalTime={match.baseTime} className="bg-white/95" />}
              {move.black && <TimeBar timeTaken={move.black.difference} totalTime={match.baseTime} className="bg-white/20" />}
            </div>
          </span>
        </div>
      ))}
    </ScrollArea>
  );
}

function TimeBar({ timeTaken, totalTime, className }: { timeTaken: number; totalTime: number; className?: string }) {
  const totalWidth = 250;
  const whitepercentage = (timeTaken * 100) / totalTime;
  const width = (totalWidth * whitepercentage) / 100 + "px";
  return (
    <>
      <div className={cn("col-span-11 m-auto mr-1 h-[10px] max-w-[250px] rounded-[2px]", className)} style={{ width }} />
      <span className="my-auto text-muted-foreground" style={{ fontSize: "10px", lineHeight: "10px" }}>
        {(timeTaken / 1000).toFixed(1)} s
      </span>
    </>
  );
}
function timeCalculateAdvance(moves: Move[], startedTime: Date) {
  const list = [{ timestamp: startedTime }, ...moves];
  const whiteList = [];
  const blackList = [];
  const final = [];
  if (list.length > 1) {
    for (let i = 0; i < list.length - 1; i++) {
      const first = list[i]!;
      const second = list[i + 1]! as Move;
      const difference = second.timestamp.getTime() - first.timestamp.getTime();
      if (i % 2 === 0) {
        whiteList.push({ difference, move: second });
      } else {
        blackList.push({ difference, move: second });
      }
    }
  }
  for (let i = 0; i < Math.max(whiteList.length, blackList.length); i++) {
    const white = whiteList[i];
    const black = blackList[i];
    final.push({ white, black });
  }
  return final;
}
