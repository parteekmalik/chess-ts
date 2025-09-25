"use client";

import { MatchesList } from "./MatchesList";

interface ActiveMatchesListProps {
  title?: string;
  className?: string;
}

export function ActiveMatchesList({
  title = "Active Matches",
  className = ""
}: ActiveMatchesListProps) {
  return (
    <MatchesList
      title={title}
      className={className}
      showActive={true}
      showWaiting={false}
      showFinished={false}
    />
  );
}
