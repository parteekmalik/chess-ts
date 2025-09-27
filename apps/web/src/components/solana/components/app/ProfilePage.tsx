"use client";

import type { Address } from "gill";

import type { MatchAccount } from "@acme/chess-queries";
import { MatchStatus } from "@acme/anchor";
import { useCleanProfileMutation, useConnectedWalletProfile, useConnectedWalletProfileMatches, useProfile } from "@acme/chess-queries";
import { formatAddress } from "@acme/lib";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

export function ProfilePage({ profileAddress }: { profileAddress: Address }) {
  const { data: walletProfile } = useConnectedWalletProfile();
  const { data: chessProfile } = useProfile(profileAddress);
  const cleanProfileMutaion = useCleanProfileMutation();
  const { data: playedMatches, isLoading: matchesLoading } = useConnectedWalletProfileMatches() as {
    data: MatchAccount[] | undefined;
    isLoading: boolean;
  };
  const matches = playedMatches ?? [];

  if (!chessProfile) return null;

  // Wallet is connected and profile exists, show the profile content
  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-primary">Chess Profile</h1>
        <p className="text-xl text-muted-foreground">Your chess statistics and match history</p>
      </div>

      <Separator />

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{chessProfile.displayName}</CardTitle>
              <CardDescription>Address: {formatAddress(chessProfile.address)}</CardDescription>
            </div>
            {walletProfile?.address === chessProfile.address && (
              <Button variant={"destructive"} onClick={() => cleanProfileMutaion.mutate({ profileAddress: chessProfile.address })}>
                Clean Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{chessProfile.rating}</div>
              <div className="text-sm text-muted-foreground">Current Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {`${((chessProfile.wins / (chessProfile.wins + chessProfile.losses + chessProfile.draws)) * 100).toFixed(1)}%`}
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{chessProfile.wins + chessProfile.losses + chessProfile.draws}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{chessProfile.wins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{chessProfile.losses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{chessProfile.draws}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">N/A</div>
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
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading your matches...</p>
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.matchId.toString()} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={match.status === MatchStatus.Active ? "default" : match.status === MatchStatus.Finished ? "secondary" : "outline"}
                      >
                        {match.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Match #{match.matchId.toString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.baseTimeSeconds}s + {match.incrementSeconds}s
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">White:</span>
                      <div className="font-medium">{match.white ? formatAddress(match.white) : "TBD"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Black:</span>
                      <div className="font-medium">{match.black ? formatAddress(match.black) : "TBD"}</div>
                    </div>
                  </div>

                  {match.status === MatchStatus.Finished && (
                    <div className="mt-2 border-t pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Finished:</span>
                        <Badge variant="secondary">{match.finishedAt ? new Date(match.finishedAt).toLocaleDateString() : "Completed"}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No matches played yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Start playing to see your match history here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
