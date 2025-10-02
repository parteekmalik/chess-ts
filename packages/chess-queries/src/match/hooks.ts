// Match React Query hooks and mutations - works independently from API

import type { Address } from "gill";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";
import _ from "lodash";
import { toast } from "sonner";

import {
  getCloseChessMatchInstruction,
  getCreateChessMatchInstructionAsync,
  getJoinChessMatchInstructionAsync,
  getMakeMoveInstructionAsync,
  MatchStatus,
} from "@acme/anchor";
import { randomSafeMath } from "@acme/lib";

import { useInvalidateCryptoQueries } from "../utils/invalidate-all-queries";
import { useWalletTransactionSignAndSend } from "../utils/use-wallet-transaction-sign-and-send";
import { useWalletUiSigner } from "../utils/use-wallet-ui-signer";
import { matchFetcher } from "./fetcher";

// ===== QUERY HOOKS =====

export function useChessMatch(matchAddress: Address) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["match", matchAddress],
    queryFn: async () => {
      const account = await matchFetcher.getMatch(matchAddress, client.rpc);
      return account;
    },
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    structuralSharing(oldData, newData) {
      if (oldData !== undefined && _.isEqual(oldData, newData)) {
        return oldData;
      }
      return newData;
    },
  });
}

export function useAllMatches() {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["matches", "all"],
    queryFn: async () => {
      const accounts = await matchFetcher.getAllMatches(client.rpc);
      return accounts;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useMatchPda(matchId: number) {
  return useQuery({
    queryKey: ["match", "pda", matchId],
    queryFn: async () => {
      return await matchFetcher.getMatchPda(matchId);
    },
  });
}

export function useActiveMatches() {
  const { data: allMatches, ...rest } = useAllMatches();

  return {
    ...rest,
    data: allMatches?.filter((match) => match.status === MatchStatus.Active) ?? [],
  };
}

export function useWaitingMatches() {
  const { data: allMatches, ...rest } = useAllMatches();

  return {
    ...rest,
    data: allMatches?.filter((match) => match.status === MatchStatus.Waiting) ?? [],
  };
}

export function useFinishedMatches() {
  const { data: allMatches, ...rest } = useAllMatches();

  return {
    ...rest,
    data: allMatches?.filter((match) => match.status === MatchStatus.Finished) ?? [],
  };
}

export function useMatchesByState() {
  const { data: allMatches, isLoading, isError, error, ...rest } = useAllMatches();

  return {
    ...rest,
    isLoading,
    isError,
    error,
    activeMatches: allMatches?.filter((match) => match.status === MatchStatus.Active) ?? [],
    waitingMatches: allMatches?.filter((match) => match.status === MatchStatus.Waiting) ?? [],
    finishedMatches: allMatches?.filter((match) => match.status === MatchStatus.Finished) ?? [],
    allMatches: allMatches ?? [],
  };
}

// ===== MUTATION HOOKS =====

// Create chess match mutation
export function useCreateChessMatchMutation() {
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async ({ baseTimeSeconds, incrementSeconds }: { baseTimeSeconds: number; incrementSeconds: number }) => {
      const matchId = randomSafeMath();
      return await signAndSend(
        await getCreateChessMatchInstructionAsync({
          matchId,
          baseTimeSeconds,
          incrementSeconds,
          payer: signer,
        }),
        signer,
      );
    },
    onSuccess: async (data) => {
      toast.success(`Chess match created with ID: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create chess match: ${error.message}`);
    },
  });
}

// Join chess match mutation
export function useJoinChessMatchMutation() {
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async (matchId: bigint | number) => {
      const matchAddress = await matchFetcher.getMatchPda(matchId);
      return await signAndSend(
        await getJoinChessMatchInstructionAsync({
          chessMatch: matchAddress[0],
          payer: signer,
        }),
        signer,
      );
    },
    onSuccess: async (data, _matchAddress) => {
      toast.success(`Joined chess match: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to join chess match: ${error.message}`);
    },
  });
}

export function useMatchMakingMutation() {
  const { client } = useWalletUi();
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async ({ baseTimeSeconds, incrementSeconds }: { baseTimeSeconds: number; incrementSeconds: number }) => {
      const allMatches = await matchFetcher.getAllMatches(client.rpc)
      const sameGame = allMatches.find((match) => match.baseTimeSeconds === baseTimeSeconds && match.incrementSeconds === incrementSeconds && match.status === MatchStatus.Waiting)
      if (sameGame) {
        const matchAddress = await matchFetcher.getMatchPda(sameGame.matchId);
        return await signAndSend(
          await getJoinChessMatchInstructionAsync({
            chessMatch: matchAddress[0],
            payer: signer,
          }),
          signer,
        );
      } else {
        const matchId = randomSafeMath();
        return await signAndSend(
          await getCreateChessMatchInstructionAsync({
            matchId,
            baseTimeSeconds,
            incrementSeconds,
            payer: signer,
          }),
          signer,
        );
      }
    },
    onSuccess: async (data) => {
      toast.success(`Match making: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
  });
}

// Make move mutation
export function useMakeMoveMutation() {
  const { client } = useWalletUi();
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, move }: { matchId: bigint | number; move: string }) => {
      const matchAddress = await matchFetcher.getMatchPda(matchId);
      const matchAccount = await matchFetcher.getMatch(matchAddress[0], client.rpc);
      // Create the instruction using gill
      const opponet = matchAccount.moves.length % 2 === 0 ? matchAccount.black : matchAccount.white;
      const instruction = await getMakeMoveInstructionAsync({
        chessMatch: matchAddress[0],
        opponentProfile: opponet!,
        payer: signer,
        moveFenStr: move,
      });

      // Sign and send using wallet UI gill integration
      const signature = await signAndSend(instruction, signer);

      return { signature, matchAddress, move };
    },
    onSuccess: async (data) => {
      toast.success(`Move made: ${data.move}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: async (error: Error, variables) => {
      toast.error(`Failed to make move: ${error.message}`);
      const matchAddress = (await matchFetcher.getMatchPda(variables.matchId))[0];
      queryClient.setQueryData(["match", matchAddress], () => null);
      await invalidateAllCryptoQueries();
    },
  });
}

export function useCloseChessMatchMutation() {
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async (matchId: bigint | number) => {
      const matchAddress = await matchFetcher.getMatchPda(matchId);
      return await signAndSend(
        getCloseChessMatchInstruction({
          chessMatch: matchAddress[0],
          payer: signer,
        }),
        signer,
      );
    },
    onSuccess: async (data) => {
      toast.success(`Chess match closed: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to close chess match: ${error.message}`);
    },
  });
}
