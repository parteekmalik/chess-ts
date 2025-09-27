// Match data processing

import type { Account, Address } from "gill";
import { address } from "gill";
import { z } from "zod";

import type { ChessMatch, MatchResult, MatchStatus } from "@acme/anchor";

export function matchProcessor(account: Account<ChessMatch, string>): MatchAccount {
  return {
    discriminator: new Uint8Array(account.data.discriminator),
    accType: account.data.accType,
    address: address(account.address),
    matchId: Number(account.data.id),
    white: account.data.white.__option === "Some" ? address(account.data.white.value) : undefined,
    black: account.data.black.__option === "Some" ? address(account.data.black.value) : undefined,
    status: account.data.status,
    result: account.data.result,
    baseTimeSeconds: account.data.baseTimeSeconds,
    incrementSeconds: account.data.incrementSeconds,
    whiteWinRatingChange: account.data.whiteWinRatingChange,
    blackWinRatingChange: account.data.blackWinRatingChange,
    createdAt: new Date(Number(account.data.createdAt) * 1000),
    fen: account.data.fen,
    moves: account.data.moves.map((move) => ({ san: move.san, ts: new Date(Number(move.ts) * 1000) })),
    // Optional fields
    endsAt: account.data.endsAt.__option === "Some" ? new Date(Number(account.data.endsAt.value) * 1000) : undefined,
    abandonmentAt: account.data.abandonmentAt.__option === "Some" ? new Date(Number(account.data.abandonmentAt.value) * 1000) : undefined,
    matchedAt: account.data.matchedAt.__option === "Some" ? new Date(Number(account.data.matchedAt.value) * 1000) : undefined,
    finishedAt: account.data.finishedAt.__option === "Some" ? new Date(Number(account.data.finishedAt.value) * 1000) : undefined,
  };
}

const matchMoves = z.object({ san: z.string(), ts: z.date() });
export const MatchAccountSchema = z.object({
  discriminator: z.instanceof(Uint8Array),
  accType: z.number(),
  address: z.string(),
  matchId: z.number(),
  white: z.string().optional(),
  black: z.string().optional(),
  whiteWinRatingChange: z.number(),
  blackWinRatingChange: z.number(),
  baseTimeSeconds: z.number(),
  incrementSeconds: z.number(),
  createdAt: z.date(),
  fen: z.string(),
  moves: z.array(matchMoves),
  endsAt: z.date().optional(),
  abandonmentAt: z.date().optional(),
  matchedAt: z.date().optional(),
  finishedAt: z.date().optional(),
});

export type MatchAccount = z.infer<typeof MatchAccountSchema> & {
  result: MatchResult;
  status: MatchStatus;
  address: Address;
  white: Address | undefined;
  black: Address | undefined;
};
export type MatchMove = z.infer<typeof matchMoves>;
