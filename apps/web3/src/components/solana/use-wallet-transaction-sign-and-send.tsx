import { useWalletUi } from '@wallet-ui/react'
import type { Instruction, TransactionSendingSigner } from 'gill'
import { createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners, signature as Signature } from 'gill'

export function useWalletTransactionSignAndSend() {
  const { client } = useWalletUi()

  return async (ix: Instruction | Instruction[], signer: TransactionSendingSigner) => {
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

    const transaction = createTransaction({
      feePayer: signer,
      version: 0,
      latestBlockhash,
      instructions: Array.isArray(ix) ? ix : [ix],
    })

    const signature = await signAndSendTransactionMessageWithSigners(transaction)

    // Wait for transaction confirmation before returning
    const decodedSignature = getBase58Decoder().decode(signature)

    // Wait for confirmation by polling the transaction status
    let confirmed = false
    let attempts = 0
    const maxAttempts = 30 // 30 seconds timeout

    while (!confirmed && attempts < maxAttempts) {
      try {
        const status = await client.rpc.getSignatureStatuses([Signature(decodedSignature)]).send()
        if (status.value?.[0]?.confirmationStatus === 'confirmed' || status.value?.[0]?.confirmationStatus === 'finalized') {
          confirmed = true
        } else {
          // Wait 1 second before checking again
          await new Promise(resolve => setTimeout(resolve, 1000))
          attempts++
        }
      } catch (error) {
        // If we can't check status, wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
      }
    }

    if (!confirmed) {
      console.warn('Transaction confirmation timeout, but transaction was sent successfully')
    }

    return decodedSignature
  }
}
