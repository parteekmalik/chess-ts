"use client";
import { Web3Providers } from "./providers";
import { Web3Header } from "../../components/solana/components/app-header";
import { WalletConnectionGuard } from "./walletGuard";
import { Toaster } from "@acme/ui/sonner";

export default function Web3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Web3Providers>
      <div className="min-h-screen bg-background">
        {/* Web3 Header */}
        <Web3Header />

        {/* Main Content */}
        <div className="container mx-auto">
          <WalletConnectionGuard>
            {children}
          </WalletConnectionGuard>
        </div>
      </div>
      <Toaster />
    </Web3Providers>
  );
}
