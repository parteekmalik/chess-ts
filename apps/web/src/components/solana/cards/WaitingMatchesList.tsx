"use client";

import { MatchesList } from "./MatchesList";

interface WaitingMatchesListProps {
  title?: string;
  className?: string;
}

export function WaitingMatchesList({
  title = "Waiting for Players",
  className = ""
}: WaitingMatchesListProps) {
  return (
    <MatchesList
      title={title}
      className={className}
      showActive={false}
      showWaiting={true}
      showFinished={false}
    />
  );
}
