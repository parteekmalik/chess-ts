import { useCallback, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { useTRPC } from "~/trpc/react";

export function useFindMatch() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addSocketListener, SocketEmiter } = useBackend();
  const redirectMatch = useCallback(
    () =>
      addSocketListener(
        "found_match",
        (response: unknown) => {
          const match = response as string;
          queryClient.setQueryData(trpc.liveGame.isWaitingForMatch.queryKey(), false);
          router.push(`/play/live/${match}`);
        },
        true,
      ),
    [addSocketListener, router, queryClient, trpc],
  );
  const findMatchAPI = useMutation(
    trpc.liveGame.findMatch.mutationOptions({
      onMutate() {
        queryClient.setQueryData(trpc.liveGame.isWaitingForMatch.queryKey(), true);
        redirectMatch();
      },
    }),
  );
  const findMatchViaSocket = useCallback(
    (baseTime: number, incrementTime: number) => {
      SocketEmiter("find_match", { baseTime, incrementTime });
      queryClient.setQueryData(trpc.liveGame.isWaitingForMatch.queryKey(), true);
      redirectMatch();
    },
    [SocketEmiter, redirectMatch, queryClient, trpc.liveGame.isWaitingForMatch],
  );
  const { data: isLoading } = useQuery(trpc.liveGame.isWaitingForMatch.queryOptions());
  useLayoutEffect(() => {
    if (isLoading) redirectMatch();
  }, [redirectMatch, isLoading]);

  return { findMatchAPI, redirectMatch, isLoading: isLoading ?? false, findMatchViaSocket };
}
