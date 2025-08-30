// Here we export some useful types and functions for interacting with the Anchor program.
import type { SolanaClusterId } from "@wallet-ui/react";
import { address } from "gill";

import type { ChessMatch, Profile, Registry } from "./client/js/generated/accounts";

// Export the chess-related account types using proper generated types
export type ChessMatchAccount = ChessMatch;
export type ProfileAccount = Profile;
export type RegistryAccount = Registry;

// This is a helper function to get the program ID for the Web3 program depending on the cluster.
export function getWeb3ProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case "solana:devnet":
    case "solana:testnet":
      // This is the program ID for the Web3 program on devnet and testnet.
      return address("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");
    case "solana:mainnet":
    default:
      return address("11111111111111111111111111111111"); // Placeholder - replace with actual program ID
  }
}

// Re-export all generated client code
export * from "./client/js";

// Export helper functions
export * from "./helpers/get-program-accounts-decoded";
