"use client";

import { useWalletUi } from "@wallet-ui/react";

import { useConnectedWalletProfile } from "@acme/chess-queries";
import { Badge } from "@acme/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { CreateProfileCard } from "~/components/solana/cards/CreateProfileCard";
import { ProfilePage } from "~/components/solana/components/app/ProfilePage";

function Page() {
  const { account } = useWalletUi();
  const isConnected = !!account;
  const { data: chessProfile } = useConnectedWalletProfile();

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-primary">👤</h1>
            <h2 className="text-4xl font-bold text-primary">Chess Profile</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">Connect your wallet to view your chess profile and statistics</p>
          </div>

          <Separator />

          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Wallet Required</CardTitle>
              <CardDescription>To access your chess profile, you need to connect your wallet first</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="py-4 text-center">
                <p className="mb-4 text-muted-foreground">Use the wallet connection button in the top-right header</p>
                <Badge variant="outline" className="px-4 py-2 text-lg">
                  WalletButton → Header
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">1</Badge>
                  <span>Click "Connect Wallet" in the header</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">2</Badge>
                  <span>Choose your Solana wallet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">3</Badge>
                  <span>Approve the connection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">4</Badge>
                  <span>View your profile!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-4 text-center">
            <h3 className="text-2xl font-semibold">What You'll See</h3>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="text-center">
                <CardHeader>
                  <div className="mb-2 text-3xl">📊</div>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Win/loss records, ratings, streaks</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mb-2 text-3xl">🎯</div>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Time control stats, favorite openings</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mb-2 text-3xl">📈</div>
                  <CardTitle>Progress</CardTitle>
                  <CardDescription>Rating history and improvement</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mb-2 text-3xl">🏆</div>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Milestones and records</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // If no profile exists, show create profile card
  if (!chessProfile) {
    return (
      <div className="container mx-auto space-y-8 p-6">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-primary">Chess Profile</h1>
          <p className="text-xl text-muted-foreground">Create your chess profile to start playing</p>
        </div>

        <Separator />

        <div className="mx-auto max-w-md">
          <CreateProfileCard />
        </div>
      </div>
    );
  }

  return <ProfilePage profileAddress={chessProfile.address} />;
}

export default Page;
