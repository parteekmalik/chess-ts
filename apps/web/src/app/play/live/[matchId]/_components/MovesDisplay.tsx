"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import type { Move } from "@acme/db";
import { cn } from "@acme/ui";

import type { ChatMessageType } from "./BoardWithTime";
import { useTRPC } from "~/trpc/react";

function MovesDisplay({ chatMessages }: { chatMessages?: ChatMessageType[] }) {
  const trpc = useTRPC();
  const params = useParams();
  const { data: match } = useQuery(trpc.puzzle.getMatch.queryOptions(params.matchId as string));

  const result = match?.moves.reduce((acc, curr, index) => {
    if (index % 2 === 0) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1]!.push(curr);
    }
    return acc;
  }, [] as Move[][]);
  if (!result) return null;
  return (
    <div>
      <div>
        {result.map((move, index) => (
          <div key={index} className={cn("flex w-full px-2 text-muted-foreground even:bg-white/5")}>
            <span className="flex-[0_0_20%]">{index + 1}.</span>
            <span className="flex-[0_0_40%] space-x-2">
              <span>{move[0]!.move}</span>
              <span className="text-xs">
                {"("}
                {((move[0]!.timestamps.getTime() - (result[index - 1]?.[0]?.timestamps ?? match?.startedAt)!.getTime()) / 1000).toFixed(1)} s{")"}
              </span>
            </span>
            <span className="flex-[0_0_40%] space-x-2">
              <span>{move[1]?.move}</span>
              {move[1] && (
                <span className="text-xs">
                  {"("}
                  {((move[1].timestamps.getTime() - move[0]!.timestamps.getTime()) / 1000).toFixed(1)} s{")"}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      <div>{JSON.stringify(chatMessages)}</div>
    </div>
  );
}

export default MovesDisplay;
