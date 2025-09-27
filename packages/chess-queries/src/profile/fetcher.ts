import type { Address, KeyPairSigner, SolanaClient } from "gill";

import { fetchProfile, getInitializeProfileInstructionAsync, getProfileAccounts, getProfileByWallet } from "@acme/anchor";

import { profileProcessor } from "./utils";

export const profileFetcher = {
  async getProfile(profileAddress: Address, rpcClient: SolanaClient["rpc"]) {
    const account = await fetchProfile(rpcClient, profileAddress);
    return profileProcessor(account);
  },

  async getAllProfiles(rpcClient: SolanaClient["rpc"]) {
    const accounts = await getProfileAccounts(rpcClient);
    return accounts.map(profileProcessor);
  },

  async getProfileByWalletAddress(walletAddress: Address, rpcClient: SolanaClient["rpc"]) {
    const account = await getProfileByWallet(rpcClient, walletAddress);
    return account ? profileProcessor(account) : null;
  },

  async createProfile(params: { payer: KeyPairSigner; name: string }) {
    return await getInitializeProfileInstructionAsync(params);
  },
};
