import { createSolanaClient, devnet } from "gill";

import { getWeb3ProgramIdAsAddress } from "@acme/anchor";

// Create a default RPC client for server-side operations
const solanaClient = createSolanaClient({ urlOrMoniker: "devnet" });
export function getSolanaClient() {
  return solanaClient;
}

// Get the program ID as Address type
export function getChessProgramId() {
  return getWeb3ProgramIdAsAddress();
}

// Create a client with specific RPC URL
export function createSolanaClientWithUrl(rpcUrl = "https://api.devnet.solana.com/") {
  return createSolanaClient({ urlOrMoniker: devnet(rpcUrl) });
}
