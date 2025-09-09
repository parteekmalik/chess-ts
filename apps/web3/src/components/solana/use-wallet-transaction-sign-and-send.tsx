import { useWalletUi } from '@wallet-ui/react'
import bs58 from 'bs58'
import type { AccountMeta, Instruction, TransactionSendingSigner } from 'gill'
import { createKeyPairSignerFromBytes, createSolanaClient, createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners, signature as Signature, signTransactionMessageWithSigners, SolanaError } from 'gill'

// Function to send transaction using extracted private key for better error details
async function sendTransactionWithWallet(instructions: Instruction[]) {
  // Use the extracted private key - convert base58 to Uint8Array
  const privateKeyBase58 = '3js4yHe55UxswegLMSaph4RDNDHVb4pRKVZLzK4NaVHVhUtkbNSeQ8JAPhs2M8bvz9ivYmSzp7t6aonHrVHvZHc6'
  // Convert base58 string to Uint8Array using bs58 library
  const keypairBytes = bs58.decode(privateKeyBase58)

  // Create gill signer directly from keypair bytes (64 bytes)
  const signer = await createKeyPairSignerFromBytes(keypairBytes)

  // Create a new client for sending
  const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: "devnet" })

  // Get latest blockhash
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

  // Fix instructions by removing signer objects from accounts to avoid duplicate signers
  const fixedInstructions = instructions.map(instruction => ({
    ...instruction,
    accounts: instruction.accounts?.map(account => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { signer, ...accountWithoutSigner } = account as AccountMeta<string> & { signer: unknown }
      return accountWithoutSigner
    }) || []
  }))

  // Create a single transaction with fixed instructions
  const tx = createTransaction({
    feePayer: signer,
    instructions: fixedInstructions,
    version: 'legacy',
    latestBlockhash,
  })

  // Sign and send transaction
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  await sendAndConfirmTransaction(signedTransaction).catch(error => {
    console.error(`❌ Transaction failed:`, (error as SolanaError).context)
  })
}

export function useWalletTransactionSignAndSend() {
  const { client } = useWalletUi()

  return async (ix: Instruction | Instruction[], signer: TransactionSendingSigner) => {
    const instructions = Array.isArray(ix) ? ix : [ix]

    try {
      const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

      const transaction = createTransaction({
        feePayer: signer,
        version: 0,
        latestBlockhash,
        instructions: instructions,
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
        } catch {
          // If we can't check status, wait a bit and try again
          await new Promise(resolve => setTimeout(resolve, 1000))
          attempts++
        }
      }

      if (!confirmed) {
        console.warn('⚠️ Transaction confirmation timeout, but transaction was sent successfully')
      }

      return decodedSignature
    } catch (error) {
      console.error('❌ Transaction failed, trying with extracted private key for better error details...', error)

      // Try sending with extracted private key for better error details it wilgh error
      await sendTransactionWithWallet(instructions)
    }
  }
}
