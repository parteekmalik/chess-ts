// Chess-related queries using React Query

import type { Address } from "gill";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";

// Query keys factory
export const chessQueryKeys = {
  program: () => ["chess", "program"] as const,
  accounts: (cluster: string) => ["chess", "accounts", { cluster }] as const,
  profile: (id: string) => ["chess", "profile", id] as const,
  match: (id: string) => ["chess", "match", id] as const,
  matches: (cluster: string) => ["chess", "matches", { cluster }] as const,
};

// Program ID query - simplified for now
export function useChessProgramId() {
  const { cluster } = useWalletUi();
  return useMemo(() => "11111111111111111111111111111111", [cluster]);
}

// Program account query - simplified for now
export function useChessProgram() {
  const { client } = useWalletUi();
  const programId = useChessProgramId();

  return useQuery({
    queryKey: chessQueryKeys.program(),
    queryFn: () => client.rpc.getAccountInfo(programId as Address).send(),
    retry: false,
    enabled: !!programId,
  });
}

// Chess accounts query - simplified for now
export function useChessAccounts() {
  return useQuery({
    queryKey: chessQueryKeys.accounts("mainnet"),
    queryFn: () => {
      // Placeholder - would integrate with actual anchor functions
      return Promise.resolve([]);
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    gcTime: 0,
    retry: 3,
    retryDelay: 1000,
  });
}

// Profile query - simplified for now
export function useChessProfile(profileId: string) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: chessQueryKeys.profile(profileId),
    queryFn: async () => {
      // Placeholder - would integrate with actual anchor functions
      const accountInfo = await client.rpc.getAccountInfo(profileId as Address).send();
      return accountInfo;
    },
    enabled: !!profileId,
  });
}

// Chess match query - simplified for now
export function useChessMatch(matchId: string) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: chessQueryKeys.match(matchId),
    queryFn: async () => {
      // Placeholder - would integrate with actual anchor functions
      const accountInfo = await client.rpc.getAccountInfo(matchId as Address).send();
      return accountInfo;
    },
    enabled: !!matchId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}
