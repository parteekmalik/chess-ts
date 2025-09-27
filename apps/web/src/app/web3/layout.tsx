"use client";

import { Toaster } from "@acme/ui/sonner";

import { Web3Header } from "../../components/solana/components/app-header";
import { Web3Providers } from "./providers";
import { WalletConnectionGuard } from "./walletGuard";

export default function Web3Layout({ children }: { children: React.ReactNode }) {
  return (
    <Web3Providers>
      <div className="min-h-screen">
        {/* Web3 Header */}
        <Web3Header />

        {/* Main Content */}
        <WalletConnectionGuard>{children}</WalletConnectionGuard>
      </div>
      <Toaster />
    </Web3Providers>
  );
}
