"use client";

import { MatchStatus } from "@acme/anchor";
import { useAllMatches  } from "@acme/chess-queries";
import type {MatchAccount} from "@acme/chess-queries";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@acme/ui/select";
import { Separator } from "@acme/ui/separator";
import { useWalletUi } from "@wallet-ui/react";
import { useState } from "react";

export default function FindPage() {
  const { data: allMatches, isLoading: _matchesLoading } = useAllMatches();
  const { account } = useWalletUi();
  const isConnected = !!account;

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeControlFilter, setTimeControlFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Filter matches based on search criteria
  const filteredMatches = (allMatches ?? []).filter((match: MatchAccount) => {
    const matchId = match.matchId.toString();
    const matchesSearch = searchTerm === "" ||
      matchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (match.white?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (match.black?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "all";

    const matchesTimeControl = timeControlFilter === "all" ||
      (timeControlFilter === "blitz" && match.baseTimeSeconds <= 300) ||
      (timeControlFilter === "rapid" && match.baseTimeSeconds > 300 && match.baseTimeSeconds <= 900) ||
      (timeControlFilter === "classical" && match.baseTimeSeconds > 900);

    const matchesRating = ratingFilter === "all" ||
      (ratingFilter === "beginner") ||
      (ratingFilter === "intermediate") ||
      (ratingFilter === "advanced");

    return matchesSearch && matchesStatus && matchesTimeControl && matchesRating;
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };



  const   getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.Active: return "bg-green-500";
      case MatchStatus.Waiting: return "bg-yellow-500";
      case MatchStatus.Finished: return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.Active: return "In Progress";
      case MatchStatus.Waiting: return "Waiting for Player";
      case MatchStatus.Finished: return "Game Over";
      default: return "Unknown";
    }
  };

  const getTimeControlText = (baseTime: number, _increment: number) => {
    if (baseTime <= 300) return "Blitz";
    if (baseTime <= 900) return "Rapid";
    return "Classical";
  };

  // If wallet is not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-primary">🔍</h1>
            <h2 className="text-4xl font-bold text-primary">Find Chess Matches</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your wallet to search and filter available chess matches
            </p>
          </div>

          <Separator />

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Wallet Required</CardTitle>
              <CardDescription>
                To find and join chess matches, you need to connect your wallet first
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
                  <span>Start finding matches!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">What You Can Do</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🔍</div>
                  <CardTitle>Search Matches</CardTitle>
                  <CardDescription>Find games by player, rating, or time control</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🎯</div>
                  <CardTitle>Join Games</CardTitle>
                  <CardDescription>Join waiting matches or create new ones</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">⚡</div>
                  <CardTitle>Quick Filters</CardTitle>
                  <CardDescription>Filter by status, time control, and rating</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">👥</div>
                  <CardTitle>Player Matching</CardTitle>
                  <CardDescription>Find opponents at your skill level</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wallet is connected, show the search interface
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Find Chess Matches</h1>
        <p className="text-xl text-muted-foreground">
          Search and filter available chess matches
        </p>
      </div>

      <Separator />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Find matches that match your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Match ID, player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="waiting">Waiting for Player</SelectItem>
                  <SelectItem value="active">In Progress</SelectItem>
                  <SelectItem value="finished">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeControl">Time Control</Label>
              <Select value={timeControlFilter} onValueChange={setTimeControlFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time control" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Controls</SelectItem>
                  <SelectItem value="blitz">Blitz (≤5 min)</SelectItem>
                  <SelectItem value="rapid">Rapid (5-15 min)</SelectItem>
                  <SelectItem value="classical">Classical (&gt;15 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating Level</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner (&lt;1200)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1200-1799)</SelectItem>
                  <SelectItem value="advanced">Advanced (≥1800)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Found {filteredMatches.length} matches
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTimeControlFilter("all");
                setRatingFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Matches</h2>
        {filteredMatches.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No matches found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTimeControlFilter("all");
                  setRatingFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.matchId.toString()} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Match {match.matchId.toString()}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(match.status)}>
                        {getStatusText(match.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTimeControlText(match.baseTimeSeconds, match.incrementSeconds)}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {match.status === MatchStatus.Waiting ? "Created" : "Started"}: {formatDate(match.createdAt)} •
                    Time: {match.baseTimeSeconds}s + {match.incrementSeconds}s
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground font-medium">White</Label>
                      <div className="font-mono text-sm text-muted-foreground">{match.white ? formatAddress(match.white) : "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">
                        Rating: N/A
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">Black</Label>
                      {match.black ? (
                        <>
                          <div className="font-mono text-sm text-muted-foreground">{formatAddress(match.black)}</div>
                          <div className="text-xs text-muted-foreground">
                            Rating: N/A
                          </div>
                        </>
                      ) : (
                        <div className="text-muted-foreground">Waiting for player...</div>
                      )}
                    </div>
                  </div>

                  {match.status === MatchStatus.Active && (
                    <div>
                      <Label className="text-muted-foreground font-medium">Current Position</Label>
                      <div className="font-mono text-xs bg-muted p-2 rounded">
                        {match.fen}
                      </div>
                    </div>
                  )}

                  {match.status === MatchStatus.Waiting && (
                    <div className="pt-2">
                      <Button className="w-full">
                        Join Match
                      </Button>
                    </div>
                  )}

                  {match.status === MatchStatus.Active && (
                    <div className="pt-2">
                      <Button className="w-full" variant="outline">
                        Watch Live
                      </Button>
                    </div>
                  )}

                  {match.status === MatchStatus.Finished && (
                    <div className="pt-2">
                      <Button className="w-full" variant="outline">
                        View Game
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}
