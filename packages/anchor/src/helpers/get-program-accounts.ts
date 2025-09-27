import type { Account, Address, Base58EncodedBytes, SolanaClient } from "gill";
import { getAddressEncoder, getProgramDerivedAddress } from "gill";

import type { ChessMatch, Profile, Registry } from "../client/js/generated/accounts";
import { fetchProfile, getChessMatchDecoder, getProfileDecoder, getRegistryDecoder } from "../client/js/generated/accounts";
import { CHESS_MATCH_DISCRIMINATOR } from "../client/js/generated/accounts/chessMatch";
import { PROFILE_DISCRIMINATOR } from "../client/js/generated/accounts/profile";
import { REGISTRY_DISCRIMINATOR } from "../client/js/generated/accounts/registry";
import { WEB3_PROGRAM_ADDRESS } from "../client/js/generated/programs";
import { expectAddress } from "../client/js/generated/shared";
import { getProgramAccountsDecoded } from "./get-program-accounts-decoded";

export interface GetProgramAccountsConfig {
  filter: string;
  programAddress: Address;
}

export async function getProgramAccounts(rpc: SolanaClient["rpc"], config: GetProgramAccountsConfig) {
  return await rpc
    .getProgramAccounts(config.programAddress, {
      encoding: "jsonParsed",
      filters: [
        {
          memcmp: { offset: 0n, bytes: config.filter as Base58EncodedBytes, encoding: "base58" },
        },
      ],
    })
    .send();
}
// Helper function to convert Uint8Array to base58 string for RPC filters
function uint8ArrayToBase58(bytes: Uint8Array): string {
  // Simple base58 encoding
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = BigInt(
    "0x" +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
  );
  let result = "";

  while (num > 0n) {
    result = alphabet[Number(num % 58n)] + result;
    num = num / 58n;
  }

  // Add leading '1's for leading zeros
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result = "1" + result;
  }

  return result;
}
// Separate functions with proper typing
export async function getRegistryAccount(rpc: SolanaClient["rpc"]): Promise<Account<Registry, string> | undefined> {
  try {
    const registryFilter = uint8ArrayToBase58(REGISTRY_DISCRIMINATOR);
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getRegistryDecoder(),
      filter: registryFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    });
    return accounts[0];
  } catch (error) {
    console.error("❌ Failed to fetch Registry accounts:", error);
    return;
  }
}

export async function getProfileAccounts(rpc: SolanaClient["rpc"]): Promise<Account<Profile, string>[]> {
  try {
    const profileFilter = uint8ArrayToBase58(PROFILE_DISCRIMINATOR);
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getProfileDecoder(),
      filter: profileFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    });
    return accounts;
  } catch (error) {
    console.error("❌ Failed to fetch Profile accounts:", error);
    return [];
  }
}

export async function getChessMatchAccounts(rpc: SolanaClient["rpc"]): Promise<Account<ChessMatch, string>[]> {
  try {
    const chessMatchFilter = uint8ArrayToBase58(CHESS_MATCH_DISCRIMINATOR);
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getChessMatchDecoder(),
      filter: chessMatchFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    });
    return accounts;
  } catch (error) {
    console.error("❌ Failed to fetch ChessMatch accounts:", error);
    return [];
  }
}

// Derive profile PDA for a given wallet address
export async function getProfilePda(walletAddress: Address): Promise<Address> {
  const [pda] = await getProgramDerivedAddress({
    programAddress: WEB3_PROGRAM_ADDRESS,
    seeds: [getAddressEncoder().encode(expectAddress(walletAddress))],
  });
  return pda;
}

// Fetch profile by wallet address (derives PDA and fetches)
export async function getProfileByWallet(rpc: SolanaClient["rpc"], walletAddress: Address): Promise<Account<Profile, string> | null> {
  try {
    const profileAddress = await getProfilePda(walletAddress);
    return await fetchProfile(rpc, profileAddress);
  } catch {
    console.log("profile not found for connected wallet");
    return null;
  }
}
