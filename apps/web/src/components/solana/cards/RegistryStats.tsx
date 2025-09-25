"use client";

import { useRegistry } from "@acme/chess-queries";
import { RegistryCard } from "../cards/RegistryCard";

interface RegistryStatsProps {
  title?: string;
  className?: string;
}

export function RegistryStats({
  title = "Chess Registry",
  className = ""
}: RegistryStatsProps) {
  const { data: registry, isLoading, error } = useRegistry();

  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground">Loading registry data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-destructive">Error loading registry: {error.message}</div>
      </div>
    );
  }

  if (!registry) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-muted-foreground">Registry not available</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <RegistryCard registry={registry} />
    </div>
  );
}
