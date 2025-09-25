// Match data fetching - works independently from API

import type { Address, SolanaClient } from "gill";
import { getProgramDerivedAddress, getU64Encoder } from "gill";

import { expectSome, getWeb3ProgramIdAsAddress } from "@acme/anchor";

import {
  fetchChessMatch,
  getChessMatchAccounts
} from "@acme/anchor";
import { matchProcessor } from "./utils";

export const matchFetcher = {
  async getMatch(matchAddress: Address, rpcClient: SolanaClient['rpc']) {
    const account = await fetchChessMatch(rpcClient, matchAddress);
    return matchProcessor(account);
  },

  async getMatchPda(matchId: number | bigint) {
    return await getMatchPda(matchId);
  },

  async getAllMatches(rpcClient: SolanaClient['rpc']) {
    const accounts = await getChessMatchAccounts(rpcClient);
    return accounts.map(matchProcessor);
  },
}

// Match PDA - derived from match ID
export async function getMatchPda(matchId: number | bigint) {
  return await getProgramDerivedAddress({
    programAddress: getWeb3ProgramIdAsAddress(),
    seeds: [getU64Encoder().encode(expectSome(Number(matchId)))],
  });
}
