"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Chess } from "chess.js";
import moment from "moment";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { calculateTimeLeft } from "@acme/lib";

import type { ChessMoveType } from "~/components/board/boardMain";
import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { env } from "~/env";
import { useTRPC } from "~/trpc/react";
import BoardWithTime from "./_components/BoardWithTime";
import Result from "./_components/result";

const LiveBoard: React.FunctionComponent = () => {
  const params = useParams();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const { SocketEmiter, lastMessage, backendServerConnection } = useBackend();

  const { data: match, isLoading } = useQuery(trpc.puzzle.getMatch.queryOptions(params.matchId as string));

  useEffect(() => {
    SocketEmiter("join_match", params.matchId, (responce: { data?: NOTIFICATION_PAYLOAD; error?: string }) => {
      console.log("joined match -> ", responce);
      if (responce.data) console.info("joined match: ", responce.data.id);
      else router.push("/play/live");
    });
  }, [params.matchId, SocketEmiter, backendServerConnection]);

  useEffect(() => {
    if (lastMessage.type === "joined_match") {
      const payload = lastMessage.payload as unknown as { id: string; count: number };
      toast.success(`user ${payload.id} joined match. Total count is ${payload.count} now`);
    } else if (lastMessage.type === "match_update") {
      if (lastMessage.payload.id === params.matchId) {
        const payload = {
          ...lastMessage.payload,
          startedAt: new Date(lastMessage.payload.startedAt),
          moves: lastMessage.payload.moves.map((move) => ({ ...move, timestamps: new Date(move.timestamps) })),
        };
        console.log("match update -> ", lastMessage.payload);

        queryClient.setQueryData(trpc.puzzle.getMatch.queryKey(params.matchId), payload);
      }
    }
  }, [lastMessage]);

  const gameState = useMemo(() => {
    const game = new Chess();
    if (match) {
      match.moves.forEach((move) => {
        game.move(move.move);
      });
    }
    return game;
  }, [match?.moves]);

  const handleMove = useCallback(
    (move: ChessMoveType) => {
      console.log("move in live board -> ", move, moment().format("HH:mm:ss"));
      SocketEmiter("make_move_match", { move, matchId: params.matchId });
    },
    [params.matchId, SocketEmiter],
  );

  const playerTimes = useMemo(() => {
    const timeData = match
      ? calculateTimeLeft(
          { baseTime: match.baseTime, incrementTime: match.incrementTime },
          [match.startedAt].concat(match.moves.map((move) => move.timestamps)),
        )
      : { w: 0, b: 0 };
    return timeData;
  }, [match?.moves]);

  const openResult = useMemo(() => match?.stats?.winner !== "PLAYING", [match?.stats?.winner]);

  if (isLoading) return <div>Loading...</div>;
  if (!match) return <div>Match not found</div>;

  const iAmPlayer = match.whitePlayerId === session?.user.id ? "w" : match.blackPlayerId === session?.user.id ? "b" : null;

  return (
    <div className="text-background-foreground flex w-full flex-col">
      <BoardWithTime
        disabled
        gameState={gameState}
        initalFlip={iAmPlayer ?? "w"}
        isWhiteTurn={match.moves.length % 2 === 0}
        whitePlayerData={{ time: playerTimes.w, id: match.whitePlayerId }}
        blackPlayerData={{ time: playerTimes.b, id: match.blackPlayerId }}
        handleMove={handleMove}
      />
      {openResult && <Result playerTurn={iAmPlayer} matchId={params.matchId as string} />}

      {env.NODE_ENV === "development" && (
        <details className="flex w-[50%] flex-col">
          <summary className="hover:cursor-pointer">Socket IO Information:</summary>
          <pre>
            <div className="flex flex-col">
              <pre>{JSON.stringify([iAmPlayer, match.stats])}</pre>
              <div>{JSON.stringify(params)}</div>
              <div className="flex flex-col gap-2">
                <span>Player Turn: {iAmPlayer}</span>
                <span>White Time: {playerTimes.w}</span>
                <span>Black Time: {playerTimes.b}</span>
              </div>
            </div>
          </pre>
        </details>
      )}
    </div>
  );
};

export default LiveBoard;
