import {
  getRegistryAccount,
  getProfileAccounts,
  getChessMatchAccounts,
  getWeb3ProgramId,
  getCreateChessMatchInstructionAsync,
  getJoinChessMatchInstructionAsync,
  getInitializeRegistryInstructionAsync,
  getInitializeProfileInstructionAsync,
  getMakeMoveInstructionAsync,
  fetchChessMatch,
  fetchProfile,
  getProfileByWallet,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getWeb3ProgramId(cluster.id), [cluster])
}

export function useProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useInitializeRegistryMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getInitializeRegistryInstructionAsync({ payer: signer }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['web3', 'accounts', 'registry', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useInitializeProfileMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async (name: string) => {
      return await signAndSend(await getInitializeProfileInstructionAsync({ payer: signer, name }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['web3', 'accounts', 'profile', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useCreateChessMatchMutation() {
  const invalidateAll = useInvalidateAll()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async ({ baseTimeSeconds, incrementSeconds }: { baseTimeSeconds: number, incrementSeconds: number }) => {
      const randomSafeMath = (): number => {
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      }

      const matchId = randomSafeMath()
      return await signAndSend(await getCreateChessMatchInstructionAsync({ payer: signer, baseTimeSeconds, incrementSeconds, matchId }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAll()
    },
  })
}

export function useJoinChessMatchMutation() {
  const invalidateAll = useInvalidateAll()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async ({ chessMatch }: { chessMatch: Address }) =>
      await signAndSend(
        await getJoinChessMatchInstructionAsync({
          payer: signer,
          chessMatch,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAll()
    },
  })
}

export function useMakeMoveMutation() {
  const invalidateAll = useInvalidateAll()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()
  const { client } = useWalletUi()

  return useMutation({
    mutationFn: async ({ chessMatch, moveFenStr }: { chessMatch: Address, moveFenStr: string }) => {
      const match = await fetchChessMatch(client.rpc, chessMatch)

      // Get the opponent profile - check if black or white is the opponent
      let opponentProfile: Address | undefined
      if (match.data.black.__option === "Some") {
        opponentProfile = match.data.black.value
      } else if (match.data.white.__option === "Some") {
        opponentProfile = match.data.white.value
      }

      if (!opponentProfile) {
        throw new Error("No opponent found in chess match")
      }

      return await signAndSend(await getMakeMoveInstructionAsync({
        chessMatch,
        moveFenStr,
        opponentProfile,
        payer: signer,
      }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAll()
    },
  })
}

// Single invalidate function for all queries
export function useInvalidateAll() {
  const queryClient = useQueryClient()
  const { cluster } = useWalletUi()
  return () => queryClient.invalidateQueries({ queryKey: ['web3', { cluster }] })
}

// Generic function to create queries
function CreateQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>
) {
  return useQuery({
    queryKey: ['web3', queryKey],
    queryFn: async () => {
      try {
        const result = await queryFn()
        console.log('result of query: ', queryKey, result)
        return result
      } catch (error) {
        console.error(`[React Query] Query failed for ${queryKey}:`, error)
      }
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    gcTime: 0,
    retry: 3,
    retryDelay: 1000,
  })
}

// React hooks for fetching data
export function useRegistryQuery() {
  const { client } = useWalletUi()
  return CreateQuery('registry', () => getRegistryAccount(client.rpc))
}

export function useProfilesQuery() {
  const { client } = useWalletUi()
  return CreateQuery('profile', () => getProfileAccounts(client.rpc))
}

export function useChessMatchesQuery() {
  const { client } = useWalletUi()
  return CreateQuery('chessMatch', () => getChessMatchAccounts(client.rpc))
}

export function useProfileByAddressQuery(address: Address) {
  const { client } = useWalletUi()
  return CreateQuery(`profile-${address}`, () => fetchProfile(client.rpc, address))
}

export function useChessMatchByAddressQuery(address: Address) {
  const { client } = useWalletUi()
  return CreateQuery(`chessMatch-${address}`, () => fetchChessMatch(client.rpc, address))
}

export function useConnectedWalletProfileQuery() {
  const { client, account } = useWalletUi()
  return CreateQuery('connected-wallet-profile', () => {
    if (!account) {
      throw new Error('No wallet connected')
    }
    return getProfileByWallet(client.rpc, account.address as Address)
  })
}

// Fetcher object with typed methods (for backward compatibility)
export const fetcher = {
  // Fetch all accounts of each type
  registry: useRegistryQuery,
  profiles: useProfilesQuery,
  chessMatches: useChessMatchesQuery,

  // Fetch specific accounts by address
  profileByAddress: useProfileByAddressQuery,
  chessMatchByAddress: useChessMatchByAddressQuery,
}
