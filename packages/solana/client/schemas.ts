// chess_schema.ts
import { PublicKey } from "@solana/web3.js";
import * as borsh from '@coral-xyz/borsh';

export interface MoveRecordType {
  ts: number;   // i64 (UnixTimestamp)
  san: string;
}

export interface ChessMatchType {
  acc_type: number; // u8
  id: number;       // u32
  white: PublicKey | null; // Option<Pubkey> as 32-byte array or null
  black: PublicKey | null;
  status: number;   // u8 (MatchStatus repr(u8))
  white_win_rating_change: number; // u8
  black_win_rating_change: number; // u8
  base_time_seconds: number; // u32
  increment_seconds: number; // u32
  result: number; // Option<u8> (MatchResult as u8)
  created_at: number; // i64 (UnixTimestamp)
  matched_at: number | null; // Option<i64>
  finished_at: number | null; // Option<i64>
  fen: string;
  moves: MoveRecordType[];
}

const MoveRecordSchema = borsh.struct([
  borsh.i64("ts"),
  borsh.str("san"),
]);

export const ChessMatchSchema = borsh.struct([
  borsh.u8("acc_type"),
  borsh.u32("id"),
  // Option<Pubkey> -> option(array(u8,32))
  borsh.option(borsh.publicKey(), "white"),
  borsh.option(borsh.publicKey(), "black"),
  // enum repr(u8)
  borsh.u8("status"),
  borsh.u8("white_win_rating_change"),
  borsh.u8("black_win_rating_change"),
  borsh.u32("base_time_seconds"),
  borsh.u32("increment_seconds"),
  // Option<MatchResult> encoded as Option<u8>
  borsh.u8("result"),
  borsh.i64("created_at"),
  borsh.option(borsh.i64(), "matched_at"),
  borsh.option(borsh.i64(), "finished_at"),
  borsh.str("fen"),
  // Vec<MoveRecord>
  borsh.vec(MoveRecordSchema, "moves"),
]);

export const ChessMatchCreateInstructionSchema = borsh.struct([
  borsh.u32("id"),
  borsh.u32("base_time_seconds"),
  borsh.u32("increment_seconds"),
])

export interface ProfileType {
  acc_type: number;
  wallet: PublicKey,
  rating: number,
  wins: number,
  losses: number,
  draws: number,
  display_name: string,
  matches: PublicKey[]
}
export const ProfileSchema = borsh.struct([
  borsh.u8("acc_type"),
  borsh.publicKey('wallet'),
  borsh.u32('rating'),
  borsh.u32('wins'),
  borsh.u32('losses'),
  borsh.u32('draws'),
  borsh.str('display_name'),
  borsh.vec(borsh.publicKey(), 'matches')
]);
export const ProfileCreateInstructionSchema = borsh.struct([
  borsh.str("name"),
])

export interface RegistryType {
  acc_type: number;
  matches_played: number,
  matches_pending: number,
}
export const RegistrySchema = borsh.struct([
  borsh.u8("acc_type"),
  borsh.u32("matches_played"),
  borsh.u32("matches_pending"),
]);
