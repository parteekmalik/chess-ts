"use client";

import type { ProfileAccount } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

interface ProfileCardProps {
  profile: ProfileAccount;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Card key={profile.wallet}>
      <CardHeader>
        <CardTitle>{profile.displayName}</CardTitle>
        <CardDescription>
          Wallet: {formatAddress(profile.wallet)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Rating: {profile.rating}</p>
          <p>Wins: {profile.wins} | Losses: {profile.losses} | Draws: {profile.draws}</p>
          <p>Matches: {profile.matches.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
