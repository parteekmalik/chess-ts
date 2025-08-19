import { PublicKey } from "@solana/web3.js";
import { arrayToPubkey, CHESS_PROGRAM_ID } from "./global";
import * as borsh from '@coral-xyz/borsh';

const GameAccountSchema = borsh.struct([
  borsh.u64('id'),
  borsh.array(borsh.u8(), 32, 'white'),
  borsh.array(borsh.u8(), 32, 'black'),
  borsh.str('fen'),
  borsh.vec(borsh.str(), 'moves'),
]);

export function deriveGamePDA(
  white: PublicKey,
  black: PublicKey,
  id: bigint
): [PublicKey, number] {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(id);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('clasic'), white.toBuffer(), black.toBuffer(), idBuf],
    CHESS_PROGRAM_ID
  );
}

export function decodeMatchAccount(buffer?: Buffer | Uint8Array | null) {
  if (!buffer) return null;
  try {
    // borsh.decode will read from the start; extra trailing bytes are ignored by this implementation.
    const decoded = GameAccountSchema.decode(Buffer.from(buffer));
    return {
      white: arrayToPubkey(decoded.white),
      black: arrayToPubkey(decoded.black),
      moves: decoded.moves as string[],
      fen: decoded.fen as string,
    };
  } catch (err) {
    console.error('Failed to decode Game account:', err);
    return null;
  }
}
