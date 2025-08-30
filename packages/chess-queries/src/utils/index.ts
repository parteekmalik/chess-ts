// Utility functions for chess queries

import type { QueryClient } from "@tanstack/react-query";

// Query invalidation utilities
export const invalidateChessQueries = async (queryClient: QueryClient, cluster: string) => {
  await queryClient.invalidateQueries({
    queryKey: ["chess", "accounts", { cluster }],
  });
};

export const invalidateChessMatch = async (queryClient: QueryClient, matchId: string) => {
  await queryClient.invalidateQueries({
    queryKey: ["chess", "match", matchId],
  });
};

// Chess game utilities
export const isValidFEN = (fen: string): boolean => {
  // Basic FEN validation - you can make this more sophisticated
  const fenParts = fen.split(" ");
  return fenParts.length >= 4;
};

export const isGameActive = (status: string): boolean => {
  return status === "active";
};

export const isGameWaiting = (status: string): boolean => {
  return status === "waiting";
};

export const isGameFinished = (status: string): boolean => {
  return status === "finished";
};

// Time utilities for chess games
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const calculateTimeControl = (baseTime: number, increment: number): string => {
  return `${formatTime(baseTime)}+${increment}`;
};
