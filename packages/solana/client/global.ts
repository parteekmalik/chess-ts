import { getKeypairFromFile } from "@solana-developers/helpers";
import { PublicKey } from "@solana/web3.js";

export const CHESS_PROGRAM_ID = new PublicKey(
  '8NtB4KqaEWKbtA9F5t8PBSkYQLdeth8sHPUDQxER55dc'
);

export const VARIANT_INIT_REGISTRY = 0;
export const VARIANT_WAIT_PLAYER = 1;
export const VARIANT_MATCH_PLAYER = 2;
export const VARIANT_MAKE_MOVE = 3;

export function pubkeyToArray(pubkey: PublicKey): number[] {
  return Array.from(pubkey.toBytes()); // 32 numbers
}

export function arrayToPubkey(arr: number[] | Uint8Array | Buffer): PublicKey {
  return new PublicKey(Buffer.from(arr));
}

export async function getKeyPairs() {
  const white = await getKeypairFromFile('./white.json');
  const black = await getKeypairFromFile('./black.json');
  return { white, black }
}