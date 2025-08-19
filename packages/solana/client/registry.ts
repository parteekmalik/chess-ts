import * as web3 from '@solana/web3.js'
import { CHESS_PROGRAM_ID } from './global';

export function deriveRegistryPDA(): [web3.PublicKey, number] {
  return web3.PublicKey.findProgramAddressSync([Buffer.from('games_registry')], CHESS_PROGRAM_ID);
}