import { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Chess } from "chess.js";
import moment from "moment";
import toast from "react-hot-toast";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { calculateTimeLeft } from "@acme/lib";

import type { ChessMoveType } from "~/components/board/boardMain";
import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { useTRPC } from "~/trpc/react";

export const useLiveGame = () => {
  const params = useParams();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  return { match, isLoading, gameState, playerTimes, handleMove, openResult, params };
};
