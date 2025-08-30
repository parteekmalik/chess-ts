// Chess-related mutations using React Query

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";
import { toast } from "sonner";

import type { CloseChessMatchParams, CreateChessMatchParams, JoinChessMatchParams, MakeMoveParams } from "../types";
import { chessQueryKeys } from "../queries";

// Initialize profile mutation
export function useInitializeProfileMutation() {
  const { cluster } = useWalletUi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name }: { name: string }): Promise<{ profile: string; name: string }> => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve({ profile: "profile-address", name });
    },
    onSuccess: async (data: { profile: string; name: string }) => {
      toast.success(`Profile initialized: ${data.name}`);
      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.accounts(cluster.id),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to initialize profile: ${error.message}`);
    },
  });
}

// Create chess match mutation
export function useCreateChessMatchMutation() {
  const { cluster } = useWalletUi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      params: CreateChessMatchParams,
    ): Promise<{
      matchId: number;
      baseTimeSeconds: number;
      incrementSeconds: number;
      chessMatch: string;
      registry: string;
      profile: string;
    }> => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve({
        chessMatch: "chess-match-address",
        registry: "registry-address",
        profile: "profile-address",
        ...params,
      });
    },
    onSuccess: async (data: {
      matchId: number;
      baseTimeSeconds: number;
      incrementSeconds: number;
      chessMatch: string;
      registry: string;
      profile: string;
    }) => {
      toast.success(`Chess match created with ID: ${data.matchId}`);
      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.accounts(cluster.id),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create chess match: ${error.message}`);
    },
  });
}

// Join chess match mutation
export function useJoinChessMatchMutation() {
  const { cluster } = useWalletUi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: JoinChessMatchParams): Promise<JoinChessMatchParams> => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve(params);
    },
    onSuccess: async (data: JoinChessMatchParams) => {
      toast.success(`Joined chess match: ${data.chessMatch}`);
      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.match(data.chessMatch),
      });
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.accounts(cluster.id),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to join chess match: ${error.message}`);
    },
  });
}

// Make move mutation
export function useMakeMoveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MakeMoveParams): Promise<MakeMoveParams> => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve(params);
    },
    onSuccess: async (data: MakeMoveParams) => {
      toast.success(`Move made: ${data.move}`);
      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.match(data.chessMatch),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to make move: ${error.message}`);
    },
  });
}

// Close chess match mutation
export function useCloseChessMatchMutation() {
  const { cluster } = useWalletUi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CloseChessMatchParams): Promise<CloseChessMatchParams> => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve(params);
    },
    onSuccess: async (data: CloseChessMatchParams) => {
      toast.success(`Chess match closed: ${data.chessMatch}`);
      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.match(data.chessMatch),
      });
      await queryClient.invalidateQueries({
        queryKey: chessQueryKeys.accounts(cluster.id),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to close chess match: ${error.message}`);
    },
  });
}
