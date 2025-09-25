"use client";

import { useState } from "react";
import { useMatchesByState } from "@acme/chess-queries";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { MatchCard } from "../cards/MatchCard";

interface MatchesListProps {
  title?: string;
  className?: string;
  showActive?: boolean;
  showWaiting?: boolean;
  showFinished?: boolean;
}

export function MatchesList({
  title = "Chess Matches",
  className = "",
  showActive = true,
  showWaiting = true,
  showFinished = false
}: MatchesListProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {
    activeMatches,
    waitingMatches,
    finishedMatches,
    isLoading
  } = useMatchesByState();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Combine matches based on props
  const filteredMatches = [
    ...(showActive ? activeMatches : []),
    ...(showWaiting ? waitingMatches : []),
    ...(showFinished ? finishedMatches : [])
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading matches...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
            </CardDescription>
          </div>
          {filteredMatches.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCollapse}
              className="flex items-center gap-2"
            >
              {isCollapsed ? (
                <>
                  <span>Show</span>
                  <span className="text-lg">▼</span>
                </>
              ) : (
                <>
                  <span>Hide</span>
                  <span className="text-lg">▲</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {!isCollapsed && filteredMatches.length > 0 && (
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.matchId.toString()}
                match={match}
              />
            ))}
          </div>
        </CardContent>
      )}

      {filteredMatches.length === 0 && (
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            No matches found
          </div>
        </CardContent>
      )}
    </Card>
  );
}
