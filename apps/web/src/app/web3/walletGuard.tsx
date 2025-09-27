import type { ReactNode } from "react";
import { useWalletUi, WalletUiDropdown } from "@wallet-ui/react";

import { useConnectedWalletProfile } from "@acme/chess-queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Dialog, DialogContent } from "@acme/ui/dialog";

import { CreateProfileCard } from "~/components/solana/cards/CreateProfileCard";

// Wallet connection guard component
export function WalletConnectionGuard({ children }: { children: ReactNode }) {
  const { account } = useWalletUi();
  const { data: profile } = useConnectedWalletProfile();

  if (!account) {
    return (
      <div className="mt-[30vh] flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Solana wallet to start playing chess on the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center">
              <WalletUiDropdown />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">You need a Solana wallet to create profiles, join matches, and play chess</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    <Dialog>
      <DialogContent>
        <CreateProfileCard />
      </DialogContent>
    </Dialog>;
  }

  return <>{children}</>;
}
