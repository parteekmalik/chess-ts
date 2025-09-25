"use client";

import { useState } from "react";
import { useAllProfiles } from "@acme/chess-queries";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { ProfileCard } from "../cards/ProfileCard";

interface ProfilesListProps {
  title?: string;
  className?: string;
}

export function ProfilesList({
  title = "Registered Players",
  className = ""
}: ProfilesListProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { data: allProfiles, isLoading, error } = useAllProfiles();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading player profiles...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-destructive">Error loading profiles: {error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!allProfiles || !Array.isArray(allProfiles) || allProfiles.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No profiles available</CardDescription>
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
              {allProfiles.length} registered player{allProfiles.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProfiles.map((profile) => (
              <ProfileCard key={profile.wallet} profile={profile} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
