"use client";

import Link from "next/link";
import { WalletUiClusterDropdown, WalletUiDropdown } from "@wallet-ui/react";

export function Web3Header() {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between p-0 lg:px-4">
        <div className="flex items-center space-x-4">
          <h1 className="hidden text-xl font-semibold text-primary lg:block">Chess Web3</h1>
          <div className="hidden h-4 w-px bg-border lg:block" />
          <nav className="flex items-center space-x-4">
            <Link href="/web3" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Chess
            </Link>
            <Link href="/web3/matches" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Matches
            </Link>
            <Link href="/web3/profile" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Profile
            </Link>
            <Link href="/web3/wallet" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Wallet
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:block">
            <WalletUiClusterDropdown />
          </div>
          <div id="wallet-dropdown">
            <WalletUiDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
