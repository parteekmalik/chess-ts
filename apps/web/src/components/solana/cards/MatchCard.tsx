"use client";

import type { Color } from "chess.js";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, Eye, Trash2, Trophy, Users } from "lucide-react";

import type { MatchAccount } from "@acme/chess-queries";
import { MatchResult, MatchStatus } from "@acme/anchor";
import { useCloseChessMatchMutation, useJoinChessMatchMutation, useProfile } from "@acme/chess-queries";
import { cn, formatAddress } from "@acme/lib";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

interface MatchCardProps {
  match: MatchAccount;
  className?: string;
}

function formatTimeControl(baseSeconds: number, incrementSeconds: number) {
  const mm = Math.floor(baseSeconds / 60);
  return `${mm}m + ${incrementSeconds}s`;
}

function avatarGradientFromAddress(address?: string | null) {
  // deterministic hue pairs from address
  const s = address ?? "0x0";
  let h1 = 0;
  let h2 = 180;
  for (let i = 0; i < s.length; i++) {
    h1 = (h1 + s.charCodeAt(i) * (i + 7)) % 360;
    h2 = (h2 + s.charCodeAt(i) * (i + 11)) % 360;
  }
  // produce two pastel-ish HSL colors
  return {
    background: `linear-gradient(135deg, hsl(${h1} 70% 60%), hsl(${h2} 70% 55%))`,
  };
}

function getInitials(address?: string | null) {
  if (!address) return "??";
  const cleaned = address.replace("0x", "");
  return cleaned.slice(0, 2).toUpperCase();
}

export function MatchCard({ match, className }: MatchCardProps) {
  const matchId = match.matchId;
  const isActive = match.status === MatchStatus.Active;
  const isWaiting = match.status === MatchStatus.Waiting;
  const isFinished = match.status === MatchStatus.Finished;

  const router = useRouter();
  const joinMatchMutation = useJoinChessMatchMutation();
  const closeMatchMutation = useCloseChessMatchMutation();

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="animate-pulse/60 flex items-center gap-2 rounded-full border-transparent bg-gradient-to-r from-green-100 to-green-50 px-3 py-1 text-green-900 shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-green-600 shadow" />
          Live
        </Badge>
      );
    }
    if (isWaiting) {
      return <Badge className="rounded-full border-yellow-200 bg-yellow-50 px-3 py-1 text-yellow-800 shadow-sm">Waiting</Badge>;
    }
    // Finished
    return <Badge className="rounded-full border-gray-200 bg-gray-50 px-3 py-1 text-gray-800 shadow-sm">Finished</Badge>;
  };

  const resultLabel = () => {
    if (!isFinished || !match.result) return null;
    switch (match.result as MatchResult) {
      case MatchResult.WhiteWin:
        return { label: "White won", icon: <Trophy className="h-4 w-4" /> };
      case MatchResult.BlackWin:
        return { label: "Black won", icon: <Trophy className="h-4 w-4" /> };
      case MatchResult.Draw:
        return { label: "Draw", icon: <Trophy className="h-4 w-4" /> };
      default:
        return null;
    }
  };

  const movesCount = match.moves.length;

  return (
    <Card className={cn("transform overflow-hidden rounded-xl border-0 transition-all hover:scale-[1.01] hover:shadow-2xl", className)}>
      <CardContent className="rounded-lg bg-foreground p-5 shadow-sm">
        <CardHeader className="mb-3 p-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">Match #{matchId}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeControl(match.baseTimeSeconds, match.incrementSeconds)}</span>
                </span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge()}
              {isFinished && resultLabel() && (
                <div className="flex items-center gap-2 text-sm text-yellow-700">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">{resultLabel()!.label}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Players */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <PlayerCard match={match} player="w" />
          <PlayerCard match={match} player="b" />
        </div>

        {/* Info row */}
        <div className="mb-4 flex justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-2 py-1">
              <Users className="h-4 w-4" />
              <span>
                {movesCount} {movesCount === 1 ? "move" : "moves"}
              </span>
            </Badge>

            <Badge className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-2 py-1">
              <span className="font-mono text-xs">#{matchId}</span>
            </Badge>
          </div>
          {isWaiting && (
            <Button onClick={() => router.push(`/web3/live/${match.address}`)} className="gap-1" variant={isActive ? "default" : "outline"}>
              <Eye className="h-4 w-4" />
              {isActive ? "Watch Live" : "View Game"}
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 border-t pt-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              {!isWaiting && (
                <Button
                  onClick={() => router.push(`/web3/live/${match.address}`)}
                  className="w-full gap-1"
                  variant={isActive ? "default" : "outline"}
                >
                  <Eye className="h-4 w-4" />
                  {isActive ? "Watch Live" : "View Game"}
                </Button>
              )}
              {isWaiting && (
                <Button
                  onClick={async () => await joinMatchMutation.mutateAsync(match.matchId)}
                  disabled={joinMatchMutation.isPending}
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {joinMatchMutation.isPending ? "Joining..." : "Join Match"}
                </Button>
              )}
            </div>

            <div className="md:w-40">
              <Button
                onClick={async () => await closeMatchMutation.mutateAsync(match.matchId)}
                disabled={closeMatchMutation.isPending}
                className="w-full"
                variant="destructive"
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {closeMatchMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const PlayerCard = ({ match, player }: { match: MatchAccount; player: Color }) => {
  const getPlayerName = (address: string | null | undefined) => {
    if (!address) return "Waiting...";
    return formatAddress(address);
  };
  const curPlayer = player === "w" ? match.white : match.black;
  const { data: profile } = useProfile(curPlayer!);
  const displayName = useMemo(() => profile?.displayName ?? (player === "w" ? "White" : "Black"), [profile, player]);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow"
          style={avatarGradientFromAddress(curPlayer)}
          title={curPlayer ?? "No address"}
        >
          {getInitials(curPlayer)}
        </div>
        <div>
          <div className="text-sm font-medium">{displayName}</div>
          <div className="font-mono text-xs text-muted-foreground">{getPlayerName(curPlayer)}</div>
        </div>
      </div>
    </div>
  );
};
