import { getKeypairFromFile } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const CHESS_PROGRAM_ID = new PublicKey(
  '4849n41SmkPbZU5MLZeYQ5RMJvMSTMMnCkvaXDjhuX9G'
);
export const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);
export const VARIANT_INIT_REGISTRY = 0;
export const VARIANT_PLAYER_PROFILE = 1;
export const VARIANT_CREATE_MATCH = 2;
export const VARIANT_JOIN_MATCH = 3;
export const VARIANT_MAKE_MOVE = 4;

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