"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createSolanaDevnet, createSolanaLocalnet, createWalletUiConfig, WalletUi } from "@wallet-ui/react";

import { registerBurnerWallet } from "~/components/solana/utils/burner-wallet";

declare global {
  interface Window {
    _burnerWalletChangeCallback?: (data: unknown) => void;
  }
}

const queryClient = new QueryClient({
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
});

// Web3-specific React Query configuration
function Web3ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

registerBurnerWallet();

// Wallet UI configuration
const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
});

export function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <Web3ReactQueryProvider>
      <WalletUi config={config}>{children}</WalletUi>
    </Web3ReactQueryProvider>
  );
}
