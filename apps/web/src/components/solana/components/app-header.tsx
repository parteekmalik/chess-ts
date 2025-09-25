"use client";

import Link from "next/link";
import { WalletUiDropdown, WalletUiClusterDropdown } from "@wallet-ui/react";

export function Web3Header() {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-primary">Chess Web3</h1>
          <div className="h-4 w-px bg-border" />
          <nav className="flex items-center space-x-4">
            <Link
              href="/web3"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Chess
            </Link>
            <Link
              href="/web3/matches"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Matches
            </Link>
            <Link
              href="/web3/profile"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/web3/wallet"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Wallet
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <WalletUiClusterDropdown />
          <WalletUiDropdown />
        </div>
      </div>
    </div>
  );
}
