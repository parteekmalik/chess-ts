"use client";

import { MatchesList } from "./MatchesList";

interface FinishedMatchesListProps {
  title?: string;
  className?: string;
}

export function FinishedMatchesList({
  title = "Finished Matches",
  className = ""
}: FinishedMatchesListProps) {
  return (
    <MatchesList
      title={title}
      className={className}
      showActive={false}
      showWaiting={false}
      showFinished={true}
    />
  );
}
