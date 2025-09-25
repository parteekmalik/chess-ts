import { useWalletUiSigner } from '@acme/chess-queries'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import type { Address, SolanaClient } from 'gill'
import {
  airdropFactory,
  createTransaction,
  getBase58Decoder,
  lamports,
  signAndSendTransactionMessageWithSigners,
} from 'gill'
import { getTransferSolInstruction } from 'gill/programs'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from 'gill/programs/token'
import { toast } from 'sonner'
import { toastTx } from '../toast-tx'
import { useInvalidateCryptoQueries } from '@acme/chess-queries'

function useGetBalanceQueryKey({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return ['get-balance', { cluster, address }]
}

// Removed unused function

export function useGetBalanceQuery({ address }: { address: Address }) {
  const { client } = useWalletUi()

  return useQuery({
    retry: false,
    queryKey: useGetBalanceQueryKey({ address }),
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}

function useGetSignaturesQueryKey({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return ['get-signatures', { cluster, address }]
}

// Removed unused function

export function useGetSignaturesQuery({ address }: { address: Address }) {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useGetSignaturesQueryKey({ address }),
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}

async function getTokenAccountsByOwner(
  rpc: SolanaClient['rpc'],
  { address, programId }: { address: Address; programId: Address },
) {
  return await rpc
    .getTokenAccountsByOwner(address, { programId }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
    .then((res) => res.value)
}

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
  const { client, cluster } = useWalletUi()

  return useQuery({
    queryKey: ['get-token-accounts', { cluster, address }],
    queryFn: async () =>
      Promise.all([
        getTokenAccountsByOwner(client.rpc, { address, programId: TOKEN_PROGRAM_ADDRESS }),
        getTokenAccountsByOwner(client.rpc, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
      ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts, ...token2022Accounts]),
  })
}

export function useTransferSolMutation({ address: _address }: { address: Address }) {
  const { client } = useWalletUi()
  const signer = useWalletUiSigner()
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries()

  return useMutation({
    mutationFn: async (input: { destination: Address; amount: number }) => {
      try {
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const transaction = createTransaction({
          feePayer: signer,
          version: 'legacy',
          latestBlockhash,
          instructions: [
            getTransferSolInstruction({
              amount: input.amount,
              destination: input.destination,
              source: signer,
            }),
          ],
        })

        const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction)
        const signature = getBase58Decoder().decode(signatureBytes)

        console.log(signature)
        return signature
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error as string}`)

        return
      }
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries()
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}

export function useRequestAirdropMutation({ address }: { address: Address }) {
  const { client } = useWalletUi()
  const invalidateAllCryptoQueries = useInvalidateCryptoQueries()
  const airdrop = airdropFactory(client)

  return useMutation({
    mutationFn: async (amount: number) => {
      if (amount <= 0) {
        amount = 1
      }
      const tx = await airdrop({
        commitment: 'confirmed',
        recipientAddress: address,
        lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
      });
      return tx
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      // Invalidate all crypto queries at once
      await invalidateAllCryptoQueries()
    },
  })
}
