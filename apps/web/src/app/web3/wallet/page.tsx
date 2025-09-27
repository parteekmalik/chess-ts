"use client";

import { useEffect, useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { address, airdropFactory, createSolanaRpc, createSolanaRpcSubscriptions, devnet, lamports } from "gill";
import { toast } from "sonner";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { AccountTokens, AccountTransactions } from "~/components/solana/components/account/account-ui";

export default function WalletPage() {
  const { account } = useWalletUi();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  // Airdrop function using gill library
  const handleAirdrop = async () => {
    if (!account) {
      toast.error("Please connect a wallet first");
      return;
    }

    setAirdropping(true);
    try {
      // Create gill RPC client for devnet
      const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
      const rpcSubscriptions = createSolanaRpcSubscriptions(devnet("wss://api.devnet.solana.com"));

      // Create airdrop function using gill
      const airdrop = airdropFactory({ rpc, rpcSubscriptions });

      // Request 1 SOL airdrop (1,000,000,000 lamports)
      await airdrop({
        commitment: "confirmed",
        recipientAddress: address(account.address),
        lamports: lamports(1_000_000_000n),
      });

      toast.success("Airdrop successful! 1 SOL added to your wallet");

      // Refresh balance
      const newBalance = await rpc.getBalance(address(account.address)).send();
      setBalance(newBalance.value.toString());
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error("Airdrop failed. Please try again");
    } finally {
      setAirdropping(false);
    }
  };

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        if (!account.address || account.address.length === 0) {
          setBalance("No address");
          return;
        }

        setLoading(true);
        try {
          const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
          const balance = await rpc.getBalance(address(account.address)).send();
          setBalance(balance.value.toString());
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance("Error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBalance().catch(console.error);
  }, [account]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatBalance = (lamports: string) => {
    const sol = parseFloat(lamports) / 1e9;
    return `${sol.toFixed(4)} SOL`;
  };

  if (!account) return null;

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-primary">Wallet Information</h1>
        <p className="text-xl text-muted-foreground/80">Check your connected wallet details and status</p>
      </div>

      <Separator />

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>Current wallet connection information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Wallet Address</h3>
                <div className="space-y-2">
                  <div className="rounded bg-muted p-2 font-mono text-sm">{account.address}</div>
                  <div className="text-xs text-muted-foreground/70">Short: {formatAddress(account.address)}</div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Balance</h3>
                <div className="space-y-2">
                  {loading ? (
                    <div className="text-muted-foreground/70">Loading...</div>
                  ) : balance !== null ? (
                    <div className="font-mono text-lg font-bold">{balance === "Error" ? "Error fetching" : formatBalance(balance)}</div>
                  ) : (
                    <div className="text-muted-foreground/70">No balance data</div>
                  )}
                  <Button onClick={handleAirdrop} disabled={airdropping || !account} size="sm" variant="outline" className="w-full">
                    {airdropping ? "Airdropping..." : "Airdrop 1 SOL"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <AccountTokens address={address(account.address)} />
          <AccountTransactions address={address(account.address)} />
        </CardContent>
      </Card>
    </div>
  );
}
