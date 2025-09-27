"use client";

import { useEffect, useMemo, useRef } from "react";

import type { MatchMove } from "@acme/chess-queries";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { ScrollArea } from "@acme/ui/scroll-area";

import { BoardSettings } from "~/components/board/BoardSettings";
import { useBoard } from "~/components/contexts/Board/BoardContextComponent";
import { ListCollapser } from "../solana/components/list-collapser";

export function MovesDisplay() {
  const {
    gameData,
    boardFunctions: { gotoMove },
  } = useBoard();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => timeCalculateAdvance(gameData?.moves, gameData?.startedAt), [gameData]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [result]);

  return (
    <>
      <ScrollArea className="h-40 border-t border-white/15">
        <div ref={scrollRef} className="overflow-aut flex max-h-40">
          <div className="flex w-fit flex-col">
            {result.map((_, index) => (
              <div key={index} className={cn("flex h-[30px] w-full items-center px-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
                <p className="text-muted-foreground">{index + 1}.</p>
              </div>
            ))}
          </div>
          <div className="flex w-fit flex-col">
            {result.map((move, index) => (
              <div key={index} className={cn("h-[30px] w-full px-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
                {move.white && (
                  <Button variant="ghost" className="h-[30px] p-0" style={{ lineHeight: "30px" }} onClick={() => gotoMove(index * 2)}>
                    {move.white.move.san}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex w-fit flex-col">
            {result.map((move, index) => (
              <div key={index} className={cn("h-[30px] w-full px-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
                {move.black && (
                  <Button variant="ghost" className="h-[30px] p-0" style={{ lineHeight: "30px" }} onClick={() => gotoMove(index * 2 + 1)}>
                    {move.black.move.san}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex grow flex-col">
            {result.map((move, index) => (
              <div key={index} className={cn("h-[30px] w-full pl-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
                <div className="h-[30px] items-end py-[3px]">
                  <div className={cn("flex-1")}>
                    {
                      <div
                        className={cn("ml-auto h-[10px] max-w-[250px] rounded-[2px]", "bg-white/95")}
                        style={{ width: (move.white?.difference ? (move.white.difference * 100) / gameData!.baseTime : 0) + "%" }}
                      />
                    }
                  </div>
                  <div className={cn("mt-[4px] flex-1")}>
                    {
                      <div
                        className={cn("ml-auto h-[10px] max-w-[250px] rounded-[2px]", "bg-white/20")}
                        style={{ width: (move.black?.difference ? (move.black.difference * 100) / gameData!.baseTime : 0) + "%" }}
                      />
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {result.map((move, index) => (
              <div key={index} className={cn("h-[30px] w-full pr-4 text-sm text-white/80 odd:bg-black/10 even:bg-[#ffffff05]")}>
                <div className="h-[30px] items-end py-[3px]">
                  <p className="ml-1 text-muted-foreground" style={{ fontSize: "10px", lineHeight: "10px" }}>
                    {move.white?.difference ? `${(move.white.difference / 1000).toFixed(1)} s` : ""}
                  </p>
                  <p className="ml-1 mt-[4px] text-muted-foreground" style={{ fontSize: "10px", lineHeight: "10px" }}>
                    {move.black?.difference ? `${(move.black.difference / 1000).toFixed(1)} s` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <BoardSettings />
      <ListCollapser title="debug match">
        <pre className="text-white">{JSON.stringify(gameData, null, 2)}</pre>
      </ListCollapser>
    </>
  );
}

function timeCalculateAdvance(moves?: MatchMove[], startedTime?: Date) {
  if (!moves || !startedTime) return [];
  const list = [{ ts: startedTime }, ...moves];
  const whiteList = [];
  const blackList = [];
  const final = [];
  if (list.length > 1) {
    for (let i = 0; i < list.length - 1; i++) {
      const first = list[i]!;
      const second = list[i + 1]! as MatchMove;
      const difference = second.ts.getTime() - first.ts.getTime();
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
