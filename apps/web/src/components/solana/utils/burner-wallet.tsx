import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Transaction, Connection } from '@solana/web3.js'
import type { Wallet, WalletAccount } from '@wallet-ui/react'
import { getWallets } from '@wallet-ui/react'

const adapter = new UnsafeBurnerWalletAdapter()
// Create a connection for sending transactions
const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
// Create a wallet standard wrapper for UnsafeBurnerWalletAdapter
function createBurnerWalletStandard(): Wallet {
  const wallet = {
    version: '1.0.0',
    name: 'Burner Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNCAxMC42djIuN2wtOS41IDE2LjVoLTQuNmw2LTEwLjVhMi4xIDIuMSAwIDEgMCAyLTMuNGw0LjgtOC4zYTQgNCAwIDAgMSAxLjMgM1ptLTQuMyAxOS4xaC0uNmw0LjktOC40djQuMmMwIDIuMy0yIDQuMy00LjMgNC4zWm0yLTI4LjRjLS4zLS44LTEtMS4zLTItMS4zaC0xLjlsLTIuNCA0LjNIMzBsMS43LTNabS0zIDVoLTQuNkwxMC42IDI5LjhoNC43TDI4LjggNi40Wk0xOC43IDBoNC42bC0yLjUgNC4zaC00LjZMMTguNiAwWk0xNSA2LjRoNC42TDYgMjkuOEg0LjJjLS44IDAtMS43LS4zLTIuNC0uOEwxNSA2LjRaTTE0IDBIOS40TDcgNC4zaDQuNkwxNCAwWm0tMy42IDYuNEg1LjdMMCAxNi4ydjhMMTAuMyA2LjRaTTQuMyAwaC40TDAgOC4ydi00QzAgMiAxLjkgMCA0LjMgMFoiIGZpbGw9IiM5OTQ1RkYiLz48L3N2Zz4=',
    chains: ['solana:devnet', 'solana:testnet', 'solana:localnet'],
    features: {
      'standard:connect': {
        version: '1.0.0',
        connect: async () => {
          // Use the same adapter instance that was created initially
          await adapter.connect()

          if (!adapter.publicKey) {
            throw new Error('Failed to generate keypair')
          }

          const connectedAccount: WalletAccount = {
            address: adapter.publicKey.toString(),
            publicKey: adapter.publicKey.toBytes(),
            chains: ['solana:devnet', 'solana:mainnet-beta', 'solana:testnet', 'solana:localnet'],
            features: ['solana:signTransaction', 'solana:signMessage', 'solana:signAndSendTransaction'],
            label: 'Burner Account',
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNCAxMC42djIuN2wtOS41IDE2LjVoLTQuNmw2LTEwLjVhMi4xIDIuMSAwIDEgMCAyLTMuNGw0LjgtOC4zYTQgNCAwIDAgMSAxLjMgM1ptLTQuMyAxOS4xaC0uNmw0LjktOC40djQuMmMwIDIuMy0yIDQuMy00LjMgNC4zWm0yLTI4LjRjLS4zLS44LTEtMS4zLTItMS4zaC0xLjlsLTIuNCA0LjNIMzBsMS43LTNabS0zIDVoLTQuNkwxMC42IDI5LjhoNC43TDI4LjggNi40Wk0xOC43IDBoNC42bC0yLjUgNC4zaC00LjZMMTguNiAwWk0xNSA2LjRoNC42TDYgMjkuOEg0LjJjLS44IDAtMS43LS4zLTIuNC0uOEwxNSA2LjRaTTE0IDBIOS40TDcgNC4zaDQuNkwxNCAwWm0tMy42IDYuNEg1LjdMMCAxNi4ydjhMMTAuMyA2LjRaTTQuMyAwaC40TDAgOC4ydi00QzAgMiAxLjkgMCA0LjMgMFoiIGZpbGw9IiM5OTQ1RkYiLz48L3N2Zz4='
          }

          // Update the wallet's accounts array directly
          wallet.accounts = [connectedAccount]

          // Trigger the change event to notify @wallet-ui/react about the account update
          if (window._burnerWalletChangeCallback) {
            window._burnerWalletChangeCallback({ accounts: [connectedAccount] })
          }

          return {
            accounts: [connectedAccount]
          }
        }
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: async () => {
          await adapter.disconnect()
        }
      },
      'standard:events': {
        version: '1.0.0',
        on: (event: string, callback: (data: unknown) => void) => {
          console.log('Event listener registered for:', event)
          // Store the callback for later use
          if (event === 'change') {
            // This is the callback that @wallet-ui/react uses to get account updates
            window._burnerWalletChangeCallback = callback
          }
        }
      },
      'solana:signTransaction': {
        version: '1.0.0',
        signTransaction: async ({ transaction }: { transaction: Uint8Array }) => {
          const tx = Transaction.from(transaction)
          const signedTx = await adapter.signTransaction(tx)

          return [{ signedTransaction: signedTx.serialize() }]
        }
      },
      'solana:signMessage': {
        version: '1.0.0',
        signMessage: async ({ message }: { message: Uint8Array }) => {
          const signature = await adapter.signMessage(message)
          return [{ signature }]
        }
      },
      'solana:signAndSendTransaction': {
        version: '1.0.0',
        signAndSendTransaction: async ({ transaction }: { transaction: Uint8Array }) => {
          try {
            const tx = Transaction.from(transaction)
            const signedTx = await adapter.signTransaction(tx)
            const signature = await connection.sendRawTransaction(signedTx.serialize())
            await connection.confirmTransaction(signature, 'confirmed')
            const signatureBytes = new Uint8Array(Buffer.from(signature, 'utf8'))
            return [{ signature: signatureBytes }]
          } catch (error) {
            console.error('🔥 Burner wallet: Error in signAndSendTransaction:', error)
            throw error
          }
        }
      },
      'solana:signIn': {
        version: '1.0.0',
        signIn: async ({ message }: { message: Uint8Array }) => {
          // Sign the message for authentication
          const signature = await adapter.signMessage(message)
          return { signature }
        }
      },
      'burner:': {
        version: '1.0.0',
        // Burner-specific features
      }
    },
    accounts: [] as WalletAccount[]
  }

  return wallet as Wallet
}
// Register burner wallet immediately (not in useEffect)
export function registerBurnerWallet() {
  try {
    const wallets = getWallets()
    const burnerWallet = createBurnerWalletStandard()
    wallets.register(burnerWallet)
  } catch (error) {
    console.error('Failed to register burner wallet:', error)
  }
}
