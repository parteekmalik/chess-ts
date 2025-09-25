'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createSolanaDevnet, createSolanaLocalnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { registerBurnerWallet } from '~/components/solana/utils/burner-wallet'


// Global type declaration for the change callback
declare global {
  interface Window {
    _burnerWalletChangeCallback?: (data: unknown) => void
  }
}

// Web3-specific React Query configuration
function Web3ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 3,
            retryDelay: 1000,
          },
          mutations: {
            retry: 0,
            retryDelay: 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

registerBurnerWallet()

// Wallet UI configuration
const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
})



// Combined web3 providers
export function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <Web3ReactQueryProvider>
      <WalletUi config={config}>
        {children}
      </WalletUi>
    </Web3ReactQueryProvider>
  )
}
