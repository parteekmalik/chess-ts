"use client";

import { useMatchesByState } from "@acme/chess-queries";
import { cn } from "@acme/ui";
import { Card, CardDescription, CardHeader } from "@acme/ui/card";

import { MatchCard } from "../cards/MatchCard";

interface MatchesListProps {
  colsLength: number;
  showActive?: boolean;
  showWaiting?: boolean;
  showFinished?: boolean;
  classNames?: { grid?: string; item?: string };
}

export function MatchesList({ colsLength, classNames, showActive = false, showWaiting = false, showFinished = false }: MatchesListProps) {
  const { activeMatches, waitingMatches, finishedMatches } = useMatchesByState();

  // Combine matches based on props
  const filteredMatches = [...(showWaiting ? waitingMatches : []), ...(showActive ? activeMatches : []), ...(showFinished ? finishedMatches : [])];

  if (!filteredMatches.length) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>
            <div className="py-8 text-center text-muted-foreground">No matches found</div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("grid gap-6", classNames?.grid)} style={{ gridTemplateColumns: `repeat(${colsLength}, minmax(0, 1fr))` }}>
      {filteredMatches.map((match) => (
        <MatchCard key={match.matchId.toString()} match={match} className={classNames?.item} />
      ))}
    </div>
  );
}
