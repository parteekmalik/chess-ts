"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import type { Move } from "@acme/db";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { ScrollArea } from "@acme/ui/scroll-area";

import { BoardSettings } from "~/components/board/BoardSettings";
import { useBoard } from "~/components/contexts/Board/BoardContextComponent";
import { useTRPC } from "~/trpc/react";

export function MovesDisplay() {
  const trpc = useTRPC();
  const params = useParams();
  const { data: match } = useQuery(trpc.liveGame.getMatch.queryOptions(params.matchId as string, { enabled: !!params.matchId }));
  const {
    boardFunctions: { gotoMove },
  } = useBoard();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => timeCalculateAdvance(match?.moves, match?.startedAt), [match]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [result]);

  if (!match) return null;
  return (
    <>
      <ScrollArea className="h-40 border-t border-white/15">
        <div ref={scrollRef} className="max-h-40 overflow-auto">
          {result.map((move, index) => (
            <div key={index} className={cn("flex h-[30px] w-full items-center px-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
              <span className="flex-[0_0_5%] text-muted-foreground">{index + 1}.</span>
              <span className="flex-[0_0_10%]">
                {move.white && (
                  <Button variant="ghost" onClick={() => gotoMove(index * 2)}>
                    {move.white.move.move}
                  </Button>
                )}
              </span>
              <span className="flex-[0_0_10%]">
                {move.black && (
                  <Button variant="ghost" onClick={() => gotoMove(index * 2 + 1)}>
                    {move.black.move.move}
                  </Button>
                )}
              </span>
              <span className="flex-[0_0_75%]">
                <div className="my-[3px] ml-auto grid h-[30px] grid-cols-12 grid-rows-2 items-end">
                  {move.white && <TimeBar timeTaken={move.white.difference} totalTime={match.baseTime} className="bg-white/95" />}
                  {move.black && <TimeBar timeTaken={move.black.difference} totalTime={match.baseTime} className="bg-white/20" />}
                </div>
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <BoardSettings />
    </>
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
function timeCalculateAdvance(moves?: Move[], startedTime?: Date) {
  if (!moves || !startedTime) return [];
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
