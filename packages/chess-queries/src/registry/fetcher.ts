import { fetchRegistry } from "@acme/anchor";
import type { SolanaClient } from "gill";

import { getProgramDerivedAddress } from "gill";
import { getChessProgramId } from "../utils";

export async function getRegistryPda() {
  return await getProgramDerivedAddress({
    programAddress: getChessProgramId(),
    seeds: ["registry"],
  });
}

export const registryFetcher = {
  async getRegistry(rpcClient?: SolanaClient['rpc']) {
    try {
      if (!rpcClient) {
        throw new Error("RPC client required for blockchain operations");
      }
      const registryPda = await getRegistryPda();

      return await fetchRegistry(rpcClient, registryPda[0]);
    } catch {
      return null; // Registry might not exist yet
    }
  },

  async getRegistryPda() {
    return await getRegistryPda();
  },
};
