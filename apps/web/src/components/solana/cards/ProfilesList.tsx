"use client";

import { useAllProfiles } from "@acme/chess-queries";
import { cn } from "@acme/ui";
import { Card, CardDescription, CardHeader } from "@acme/ui/card";

import { ProfileCard } from "../cards/ProfileCard";

interface ProfilesListProps {
  colsLength: number;
  classNames?: { grid?: string; item?: string };
}

export function ProfilesList({ colsLength, classNames }: ProfilesListProps) {
  const { data: allProfiles } = useAllProfiles();

  if (!allProfiles) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>No account available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("grid gap-4", classNames?.grid)} style={{ gridTemplateColumns: `repeat(${colsLength}, minmax(0, 1fr))` }}>
      {allProfiles.map((profile) => (
        <ProfileCard key={profile.wallet} className={classNames?.item} profile={profile} />
      ))}
    </div>
  );
}
