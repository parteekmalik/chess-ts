"use client";

import { MatchAccount, useCloseChessMatchMutation, useJoinChessMatchMutation, useMakeMoveMutation } from "@acme/chess-queries";
import { formatAddress } from "@acme/lib";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { useState } from "react";
import { MatchStatus } from "@acme/anchor";

interface MatchCardProps {
  match: MatchAccount;
}

export function MatchCard({ match }: MatchCardProps) {
  const matchId = match.matchId;
  const isActive = match.status === MatchStatus.Active;
  const isWaiting = match.status === MatchStatus.Waiting;
  const isFinished = match.status === MatchStatus.Finished;

  const [moveInput, setMoveInput] = useState("");
  const makeMoveMutation = useMakeMoveMutation();
  const joinMatchMutation = useJoinChessMatchMutation();
  const closeMatchMutation = useCloseChessMatchMutation();
  const handleMakeMove = async () => {
    if (!moveInput) return;

    await makeMoveMutation.mutateAsync({
      matchId: match.matchId,
      move: moveInput,
    });
    setMoveInput("");
  };

  const getStatusColor = () => {
    switch (match.status) {
        case MatchStatus.Active:
        return "text-green-600";
      case MatchStatus.Waiting:
        return "text-yellow-600";
      case MatchStatus.Finished:
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case MatchStatus.Active:
        return "Active";
      case MatchStatus.Waiting:
        return "Waiting for Players";
      case MatchStatus.Finished:
        return "Finished";
      default:
        return "Unknown";
    }
  };

  return (
    <Card key={matchId}>
      <CardHeader>
        <CardTitle>Match #{matchId}</CardTitle>
        <CardTitle>{match.address}</CardTitle>
        <CardDescription>
          <span className={getStatusColor()}>
            Status: {getStatusText()}
          </span>
          {match.result && (
            <span className="ml-2">| Result: {match.result}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>White: {match.white ? formatAddress(match.white) : "Waiting..."}</p>
          <p>Black: {match.black ? formatAddress(match.black) : "Waiting..."}</p>
          <p>Base Time: {match.baseTimeSeconds}s | Increment: {match.incrementSeconds}s</p>
          <div className="text-xs font-mono bg-muted p-2 rounded">
            FEN: {match.fen}
          </div>
          <p>Moves: {match.moves.length > 0 ? match.moves.map(move => move.san).join(', ') : 'None'}</p>

          {/* Move input for active matches */}
          {isActive && (
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor={`move-fen-${matchId}`}>Make Move (FEN)</Label>
              <div className="flex gap-2">
                <Input
                  id={`move-fen-${matchId}`}
                  type="text"
                  placeholder="e.g., e2e4"
                  value={moveInput}
                  onChange={(e) => setMoveInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleMakeMove()}
                  disabled={!moveInput || makeMoveMutation.isPending}
                  size="sm"
                >
                  {makeMoveMutation.isPending ? 'Moving...' : 'Move'}
                </Button>
              </div>
            </div>
          )}

          {/* Join button for waiting matches */}
          {isWaiting && (
            <Button
              onClick={async () => await joinMatchMutation.mutateAsync(match.matchId)}
              disabled={joinMatchMutation.isPending}
              className="w-full"
            >
              {joinMatchMutation.isPending ? 'Joining...' : 'Join Match'}
            </Button>
          )}

          {/* Finished match info */}
          {isFinished && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                This match has been completed.
              </p>
            </div>
          )}
          <Button
            onClick={async () => await closeMatchMutation.mutateAsync(match.matchId)}
            disabled={closeMatchMutation.isPending}
            className="w-full"
            variant="destructive"
          >
            {closeMatchMutation.isPending ? 'Closing...' : 'Close Match'}
          </Button>
        </div>
      </CardContent>
    </Card >
  );
}
