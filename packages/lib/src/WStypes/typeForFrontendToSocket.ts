import type { Match, MatchResult, Move } from "@acme/db";

export const BACKEND_SERVER_UPDATE = "BACKEND_SERVER_UPDATE";
export type BACKEND_SERVER_UPDATE_PAYLOAD = "connected" | "disconneted";
export const AUTHENTICATION = "AUTHENTICATION";
export type AUTHENTICATION_PAYLOAD = "sucessful" | "unsucessful";
export const NOTIFICATION = "NOTIFICATION";
export type NOTIFICATION_PAYLOAD = Match & { moves: Move[]; stats: MatchResult };
