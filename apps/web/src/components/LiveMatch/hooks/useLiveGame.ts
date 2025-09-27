import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import type { Move } from "@acme/db";
import type { ChessMoveType } from "@acme/lib";
import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { useTRPC } from "~/trpc/react";

export const useLiveGame = (matchId?: string) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { SocketEmiter, lastMessage, backendServerConnection } = useBackend();

  const { data: match, isLoading } = useQuery(trpc.liveGame.getMatch.queryOptions(matchId!, { enabled: matchId !== undefined }));
  const reload = () => {
    if (matchId) queryClient.invalidateQueries({ queryKey: trpc.liveGame.getMatch.queryKey(matchId) }).catch((err) => console.log(err));
  };
  useEffect(() => {
    if (matchId && !isLoading && !match) {
      router.push("/404");
    }
  }, [router, match, isLoading, matchId]);

  useEffect(() => {
    SocketEmiter("join_match", matchId, (responce: { data?: NOTIFICATION_PAYLOAD; error?: string }) => {
      if (responce.data) console.info("joined match: ", responce.data.id);
    });
  }, [matchId, SocketEmiter, backendServerConnection, router]);

  useEffect(() => {
    if (lastMessage.type === "joined_match") {
      const payload = lastMessage.payload as unknown as { id: string; count: number };
      toast.success(`user ${payload.id} joined match. Total count is ${payload.count} now`);
    } else if (lastMessage.type === "match_update") {
      if (lastMessage.payload.id === matchId) {
        const payload = {
          ...lastMessage.payload,
          startedAt: new Date(lastMessage.payload.startedAt),
          moves: lastMessage.payload.moves.map((move) => ({ ...move, timestamp: new Date(move.timestamp) }) satisfies Move),
        };

        queryClient.setQueryData(trpc.liveGame.getMatch.queryKey(matchId), payload);
      }
    }
  }, [lastMessage]);

  const moveAPI = useMutation(trpc.liveGame.makeMove.mutationOptions());
  const handleMove = useCallback(
    (move: ChessMoveType) => {
      if (!match) return;
      console.log("move in live board -> ", move, moment().format("HH:mm:ss"));
      if (match.baseTime > 3600000)
        moveAPI.mutate({
          move,
          matchId: matchId!,
        });
      else SocketEmiter("make_move", { move, matchId: matchId });
    },
    [matchId, moveAPI],
  );

  const openResult = useMemo(
    () => match?.stats.winner !== "PLAYING" && session && (session.user.id === match?.blackPlayerId || session.user.id === match?.whitePlayerId),
    [match, session],
  );

  return { match, isLoading, handleMove, openResult, reload };
};
