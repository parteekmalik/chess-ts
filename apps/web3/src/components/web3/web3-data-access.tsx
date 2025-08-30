import {
  Web3Account,
  getCloseInstruction,
  getWeb3ProgramAccounts,
  getWeb3ProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useWeb3ProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getWeb3ProgramId(cluster.id), [cluster])
}

export function useWeb3Program() {
  const { client, cluster } = useWalletUi()
  const programId = useWeb3ProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useWeb3InitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const web3 = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, web3 }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['web3', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useWeb3DecrementMutation({ web3 }: { web3: Web3Account }) {
  const invalidateAccounts = useWeb3AccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ web3: web3.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useWeb3IncrementMutation({ web3 }: { web3: Web3Account }) {
  const invalidateAccounts = useWeb3AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ web3: web3.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useWeb3SetMutation({ web3 }: { web3: Web3Account }) {
  const invalidateAccounts = useWeb3AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          web3: web3.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useWeb3CloseMutation({ web3 }: { web3: Web3Account }) {
  const invalidateAccounts = useWeb3AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, web3: web3.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useWeb3AccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useWeb3AccountsQueryKey(),
    queryFn: async () => await getWeb3ProgramAccounts(client.rpc),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    gcTime: 0,
    retry: 3,
    retryDelay: 1000,
  })
}

function useWeb3AccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useWeb3AccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useWeb3AccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['web3', 'accounts', { cluster }]
}
