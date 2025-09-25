"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import type { RegistryAccount } from "../types";

interface RegistryCardProps {
  registry: RegistryAccount;
}

export function RegistryCard({ registry }: RegistryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chess Registry</CardTitle>
        <CardDescription>
          Global chess match statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Matches Played: {registry.matchesPlayed}</p>
          <p>Matches Pending: {registry.matchesPending}</p>
          <p>Matches Playing: {registry.matchesPlaying}</p>
        </div>
      </CardContent>
    </Card>
  );
}
