"use client";

import { Badge } from "@acme/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";
// import { Input } from "@acme/ui/input";
// import { Label } from "@acme/ui/label";
import { useConnectedWalletProfile, useConnectedWalletProfileMatches } from "@acme/chess-queries";
import type { MatchAccount } from "@acme/chess-queries";
import { formatAddress } from "@acme/lib";
import { useWalletUi } from "@wallet-ui/react";
import { CreateProfileCard } from "../../../components/solana/cards/CreateProfileCard";

export default function ProfilePage() {
  const { account } = useWalletUi();
  const isConnected = !!account;
  const { data: chessProfile } = useConnectedWalletProfile();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { data: playedMatches, isLoading: matchesLoading } = useConnectedWalletProfileMatches() as { data: MatchAccount[] | undefined; isLoading: boolean };
  const matches = playedMatches ?? [];

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-primary">👤</h1>
            <h2 className="text-4xl font-bold text-primary">Chess Profile</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your wallet to view your chess profile and statistics
            </p>
          </div>

          <Separator />

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Wallet Required</CardTitle>
              <CardDescription>
                To access your chess profile, you need to connect your wallet first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Use the wallet connection button in the top-right header
                </p>
                <Badge variant="outline" className="text-lg px-4 py-2">
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

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">What You'll See</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">📊</div>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Win/loss records, ratings, streaks</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🎯</div>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Time control stats, favorite openings</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">📈</div>
                  <CardTitle>Progress</CardTitle>
                  <CardDescription>Rating history and improvement</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🏆</div>
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
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Chess Profile</h1>
          <p className="text-xl text-muted-foreground">
            Create your chess profile to start playing
          </p>
        </div>

        <Separator />

        <div className="max-w-md mx-auto">
          <CreateProfileCard />
        </div>
      </div>
    );
  }

  // Wallet is connected and profile exists, show the profile content
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Chess Profile</h1>
        <p className="text-xl text-muted-foreground">
          Your chess statistics and match history
        </p>
      </div>

      <Separator />

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {chessProfile.displayName}
              </CardTitle>
              <CardDescription>
                Wallet: {formatAddress(account.address)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {chessProfile.rating}
              </div>
              <div className="text-sm text-muted-foreground">Current Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {`${((chessProfile.wins / (chessProfile.wins + chessProfile.losses + chessProfile.draws)) * 100).toFixed(1)}%`}
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {chessProfile.wins + chessProfile.losses + chessProfile.draws}
              </div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {chessProfile.wins}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {chessProfile.losses}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {chessProfile.draws}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              N/A
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating History */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Your rating progression over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Rating:</span>
              <Badge variant="default">{chessProfile.rating}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Worst Rating:</span>
              <Badge variant="secondary">{chessProfile.rating}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Win Streak:</span>
              <Badge variant="outline">N/A</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Lose Streak:</span>
              <Badge variant="outline">N/A</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Played Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Your Played Matches</CardTitle>
          <CardDescription>All matches you have participated in</CardDescription>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your matches...</p>
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.matchId.toString()} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={match.status === "active" ? "default" : match.status === "finished" ? "secondary" : "outline"}>
                        {match.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Match #{match.matchId.toString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.baseTimeSeconds}s + {match.incrementSeconds}s
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">White:</span>
                      <div className="font-medium">
                        {match.white ? formatAddress(match.white) : "TBD"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Black:</span>
                      <div className="font-medium">
                        {match.black ? formatAddress(match.black) : "TBD"}
                      </div>
                    </div>
                  </div>

                  {match.status === "finished" && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Finished:</span>
                        <Badge variant="secondary">
                          {match.finishedAt ? new Date(match.finishedAt).toLocaleDateString() : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matches played yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start playing to see your match history here!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}