// Here we export some useful types and functions for interacting with the Anchor program.

import type { ChessMatch, Profile, Registry } from "./client/js/generated/accounts";
import Web3IDL from '../target/idl/web3.json'
import { address } from "gill";

// Export the chess-related account types using proper generated types
export type ChessMatchAccount = ChessMatch;
export type ProfileAccount = Profile;
export type RegistryAccount = Registry;

// Re-export all generated client code
export * from "./client/js";
export { Web3IDL }

// Get program ID from IDL
export function getWeb3ProgramId(): string {
  return Web3IDL.address;
}

// Get program ID as Address type
export function getWeb3ProgramIdAsAddress() {
  return address(Web3IDL.address);
}

// Export helper functions
export * from "./helpers/get-program-accounts-decoded";

// Re-export functions from the working web3 app
export {
  getChessMatchAccounts,
  getProfileAccounts,
  getProfileByWallet,
  getRegistryAccount,
  getProfilePda,
} from "./helpers/get-program-accounts";
