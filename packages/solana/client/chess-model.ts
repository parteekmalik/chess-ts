// src/serializers/chess.ts
import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

/**
 * Instruction variant tags
 */
export const VARIANT_CREATE_GAME = 0;
export const VARIANT_MAKE_MOVE = 1;
export const VARIANT_INIT_REGISTRY = 2;


/**
 * Borsh schemas / layouts
 *
 * PublicKey is represented as `array(u8, 32)`.
 */

// MakeMove payload: { uci_move: string }
export const MakeMoveSchema = borsh.struct([borsh.str('uci_move')]);

// On-chain Game account layout: { white: [u8;32], black: [u8;32], moves: Vec<String> }
const GameAccountSchema = borsh.struct([
  borsh.u64('id'),
  borsh.array(borsh.u8(), 32, 'white'),
  borsh.array(borsh.u8(), 32, 'black'),
  borsh.str('fen'),
  borsh.vec(borsh.str(), 'moves'),
]);

/** Helpers to convert PublicKey to/from simple arrays */
function pubkeyToArray(pubkey: PublicKey): number[] {
  return Array.from(pubkey.toBytes()); // 32 numbers
}

function arrayToPubkey(arr: number[] | Uint8Array | Buffer): PublicKey {
  return new PublicKey(Buffer.from(arr));
}

/**
 * Encode MakeMove instruction (variant byte + borsh payload)
 */
export function encodeMakeMoveInstruction(uciMove: string): Buffer {
  const payload = { uci_move: uciMove };

  // << allocate buffer >>
  const buf = Buffer.alloc(100);
  const len = MakeMoveSchema.encode(payload, buf);

  // concat variant + encoded payload
  return Buffer.concat([Buffer.from([VARIANT_MAKE_MOVE]), buf.slice(0, len)]);
}

/**
 * Decode a Game account buffer (returns { white, black, moves })
 * Returns null on decode failures.
 */
export function decodeGameAccount(buffer?: Buffer | Uint8Array | null) {
  if (!buffer) return null;
  try {
    // borsh.decode will read from the start; extra trailing bytes are ignored by this implementation.
    const decoded = GameAccountSchema.decode(Buffer.from(buffer));
    return {
      white: arrayToPubkey(decoded.white),
      black: arrayToPubkey(decoded.black),
      moves: decoded.moves as string[],
    };
  } catch (err) {
    console.error('Failed to decode Game account:', err);
    return null;
  }
}

