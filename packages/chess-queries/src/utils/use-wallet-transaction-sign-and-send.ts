import { useWalletUi } from '@wallet-ui/react'
import type { Address, Instruction, TransactionSigner } from 'gill'
import { createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill'

export function useWalletTransactionSignAndSend() {
  const { client } = useWalletUi()

  return async (ix: Instruction | Instruction[], signer: Address | TransactionSigner) => {
    const instructions = Array.isArray(ix) ? ix : [ix]

    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

    const transaction = createTransaction({
      feePayer: signer,
      version: 'legacy',
      latestBlockhash,
      instructions: instructions,
    })

    const signature = await signAndSendTransactionMessageWithSigners(transaction)
    const decodedSignature = getBase58Decoder().decode(signature)
    return decodedSignature
  }
}
