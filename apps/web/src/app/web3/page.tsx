"use client";

import Link from "next/link";
import { useWalletUi } from "@wallet-ui/react";

import { useAllProfiles, useConnectedWalletProfileMatches } from "@acme/chess-queries";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Label } from "@acme/ui/label";
import { Separator } from "@acme/ui/separator";

import { SolanaChessDashboard } from "../../components/solana/components/solana-chess-ui";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: myMatches, isLoading: _matchesLoading } = useConnectedWalletProfileMatches() as { data: any[] | undefined; isLoading: boolean };
  const { data: allProfilesData } = useAllProfiles();
  const { account } = useWalletUi();
  const allProfiles = allProfilesData ?? [];

  // Filter my matches by state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const activeMatches = (myMatches ?? []).filter((match: any) => match.status === "active");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const waitingMatches = (myMatches ?? []).filter((match: any) => match.status === "waiting");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const finishedMatches = (myMatches ?? []).filter((match: any) => match.status === "finished");

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-primary">My Chess Dashboard</h1>
        <p className="text-xl text-muted-foreground">Your personal chess matches and statistics</p>
      </div>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/web3/live">
              <Button className="flex h-20 w-full flex-col items-center justify-center space-y-2">
                <span className="text-2xl">♟️</span>
                <span>Play Chess</span>
              </Button>
            </Link>

            <Link href="/web3/find">
              <Button className="flex h-20 w-full flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">🔍</span>
                <span>Matches</span>
              </Button>
            </Link>

            <Link href="/web3/watch">
              <Button className="flex h-20 w-full flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">👀</span>
                <span>Watch Games</span>
              </Button>
            </Link>

            <Link href="/web3/profile">
              <Button className="flex h-20 w-full flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">👤</span>
                <span>View Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{allProfiles.length}</div>
            <div className="text-sm text-muted-foreground">Registered users</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Active Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeMatches.length}</div>
            <div className="text-sm text-muted-foreground">Currently playing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Waiting Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{waitingMatches.length}</div>
            <div className="text-sm text-muted-foreground">Waiting for players</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Completed Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{finishedMatches.length}</div>
            <div className="text-sm text-muted-foreground">Games finished</div>
          </CardContent>
        </Card>
      </div>

      {/* Solana Chess Integration */}
      <SolanaChessDashboard />

      {/* Wallet Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Your Connection</CardTitle>
          <CardDescription>Current wallet and network status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="font-medium text-muted-foreground">Network</Label>
                <div className="font-mono text-sm">Devnet</div>
              </div>
              <div>
                <Label className="font-medium text-muted-foreground">Wallet Status</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant={account ? "default" : "secondary"}>{account ? "Connected" : "Not Connected"}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {account ? (
                <div>
                  <Label className="font-medium text-muted-foreground">Wallet Address</Label>
                  <div className="rounded bg-muted p-2 font-mono text-xs">{account.address}</div>
                </div>
              ) : (
                <div>
                  <Label className="font-medium text-muted-foreground">Wallet Address</Label>
                  <div className="rounded bg-muted p-2 font-mono text-xs text-muted-foreground">Not connected</div>
                </div>
              )}
              <div>
                <Label className="font-medium text-muted-foreground">Actions</Label>
                <div className="space-y-2">
                  <Link href="/web3/profile">
                    <Button size="sm" variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
