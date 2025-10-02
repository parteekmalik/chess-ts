// Profile React Query hooks and mutations - works independently from API

import type { Address, SolanaClient } from "gill";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";
import { address } from "gill";
import { toast } from "sonner";

import { fetchAllChessMatch, getCleanProfileInstructionAsync, getInitializeProfileInstructionAsync, MatchStatus } from "@acme/anchor";

import { getMatchPda, matchProcessor } from "../match";
import { useInvalidateCryptoQueries } from "../utils/invalidate-all-queries";
import { useWalletTransactionSignAndSend } from "../utils/use-wallet-transaction-sign-and-send";
import { useWalletUiSigner } from "../utils/use-wallet-ui-signer";
import { profileFetcher } from "./fetcher";

// ===== QUERY HOOKS =====

// Alias for backward compatibility
export const useChessProfile = useProfile;

async function getProfileMatchIds(profileAddress: Address, client: SolanaClient) {
  const profileAccount = await profileFetcher.getProfile(profileAddress, client.rpc);
  return profileAccount.matches;
}

// Helper function to get connected wallet profile match IDs
// NOTE: Must NOT call hooks inside helpers. Accept required params instead.
async function getConnectedWalletMatchIds(client: SolanaClient, accountAddress: string | undefined) {
  if (!accountAddress) return [];
  const profileAccount = await profileFetcher.getProfileByWalletAddress(address(accountAddress), client.rpc);
  return profileAccount?.matches ?? [];
}

// Helper function to fetch matches for a profile
async function fetchProfileMatches(matchIds: number[], client: SolanaClient) {
  if (matchIds.length === 0) return [];

  // Generate PDAs for all match IDs
  const matchPdas = await Promise.all(
    matchIds.map(async (matchId) => {
      const [pda] = await getMatchPda(matchId);
      return pda;
    }),
  );

  // Fetch all matches efficiently using fetchAllChessMatch
  const matches = await fetchAllChessMatch(client.rpc, matchPdas);

  // Process the matches
  return matches.map((match) => matchProcessor(match));
}

export function useProfile(profileAddress: Address) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["profile", profileAddress],
    queryFn: async () => {
      return await profileFetcher.getProfile(profileAddress, client.rpc);
    },
  });
}

export function useAllProfiles() {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async () => {
      return await profileFetcher.getAllProfiles(client.rpc);
    },
  });
}

export function useProfileByWallet(walletAddress: Address) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["profile", "wallet", walletAddress],
    queryFn: async () => {
      return await profileFetcher.getProfileByWalletAddress(walletAddress, client.rpc);
    },
  });
}

export function useConnectedWalletProfile() {
  const { client, account } = useWalletUi();

  return useQuery({
    queryKey: ["profile", "connected", account?.address],
    queryFn: async () => {
      return await profileFetcher.getProfileByWalletAddress(address(account!.address), client.rpc);
    },
  });
}

export function useProfileMatches(profileAddress: Address) {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["profile", "matches", profileAddress],
    queryFn: async () => {
      const matchIds = await getProfileMatchIds(profileAddress, client);
      return await fetchProfileMatches(matchIds, client);
    },
  });
}

export function useConnectedWalletProfileMatches() {
  const { client, account } = useWalletUi();

  return useQuery({
    queryKey: ["profile", "matches", "connected"],
    queryFn: async () => {
      const matchIds = await getConnectedWalletMatchIds(client, account?.address);
      return await fetchProfileMatches(matchIds, client);
    },
  });
}

export function useIsWaitForJoin() {
  const { account, client } = useWalletUi();
  return useQuery({
    queryKey: ["profile", "matches", "connected", "isWaiting"],
    queryFn: async () => {
      const matchIds = await getConnectedWalletMatchIds(client, account?.address);
      const matches = await fetchProfileMatches(matchIds, client);
      return matches.find((match) => match.status === MatchStatus.Waiting) ?? null;
    },
    refetchInterval: 5000,
  });
}

export function useFindJoinedMatch() {
  const { account, client } = useWalletUi();
  return useQuery({
    queryKey: ["profile", "matches", "connected", "activeMatch"],
    queryFn: async () => {
      const matchIds = await getConnectedWalletMatchIds(client, account?.address);
      const matches = await fetchProfileMatches(matchIds, client);
      return matches.find((match) => match.status === MatchStatus.Active) ?? null;
    },
    refetchInterval: 5000,
  });
}

// ===== MUTATION HOOKS =====

// Initialize profile mutation
export function useInitializeProfileMutation() {
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      return await signAndSend(
        await getInitializeProfileInstructionAsync({
          name,
          payer: signer,
        }),
        signer,
      );
    },
    onSuccess: async (data, { name }) => {
      toast.success(`Profile initialized: ${name} with signature: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to initialize profile: ${error.message}`);
    },
  });
}

// Clean profile mutation
export function useCleanProfileMutation() {
  const signer = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries();

  return useMutation({
    mutationFn: async ({ profileAddress }: { profileAddress: Address }) => {
      return await signAndSend(
        await getCleanProfileInstructionAsync({
          profile: profileAddress,
          payer: signer,
        }),
        signer,
      );
    },
    onSuccess: async (data, { profileAddress }) => {
      toast.success(`Profile cleaned: ${profileAddress} with signature: ${data}`);
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to clean profile: ${error.message}`);
    },
  });
}
