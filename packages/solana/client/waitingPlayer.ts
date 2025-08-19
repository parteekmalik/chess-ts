import { PublicKey } from "@solana/web3.js";
import { CHESS_PROGRAM_ID } from "./global";

export function deriveWaitingPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('waiting_player')], CHESS_PROGRAM_ID);
}