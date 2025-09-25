"use client";

import { Separator } from "@acme/ui/separator";
import { CreateMatchCard, CreateProfileCard } from "./cards";
import { ActiveMatchesList, WaitingMatchesList, ProfilesList, RegistryStats } from "./cards";


export function SolanaChessDashboard() {
  return (
    <div className="space-y-8">
      {/* Create Profile and Match Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreateProfileCard />
        <CreateMatchCard />
      </div>

      <Separator />

      {/* Registry Stats */}
      <RegistryStats />

      <Separator />

      {/* Active Matches */}
      <ActiveMatchesList />

      {/* Waiting Matches */}
      <WaitingMatchesList />

      {/* Player Profiles */}
      <ProfilesList />
    </div>
  );
}