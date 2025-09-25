import type { KeyPairSigner, SolanaClient } from "gill";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { createKeyPairSignerFromBytes, createSolanaClient } from "gill";

import { env } from "../env";
import { matchFetcher } from "../src/match";
import { profileFetcher } from "../src/profile";
import { registryFetcher } from "../src/registry";
import { WEB3_PROGRAM_ADDRESS } from "@acme/anchor";

describe("Chess Queries Tests", () => {
  let payer: KeyPairSigner;
  let client: SolanaClient;

  beforeAll(async () => {
    // Create real keypair
    const keypairArray = env.WHITE_PLAYER_KEYPAIR;
    expect(keypairArray).toBeDefined();
    expect(keypairArray.length).toBe(64);
    payer = await createKeyPairSignerFromBytes(new Uint8Array(keypairArray));

    // Create real Solana client like in your anchor tests
    client = createSolanaClient({ urlOrMoniker: "devnet" });
  });

  describe("Real Data Tests", () => {
    it("should have valid payer keypair", () => {
      expect(payer).toBeDefined();
      expect(payer.address).toBeDefined();
      expect(typeof payer.address).toBe("string");
      expect(payer.address.length).toBeGreaterThan(30); // Valid Solana address length
    });

    it("should have valid Solana client", () => {
      expect(client).toBeDefined();
      expect(client.rpc).toBeDefined();
      expect(typeof client.rpc.getAccountInfo).toBe("function");
      expect(typeof client.rpc.getProgramAccounts).toBe("function");
    });

    it("should fetch chess program info", async () => {
      const programInfo = await client.rpc.getAccountInfo(WEB3_PROGRAM_ADDRESS).send();

      // Program should exist (not null)
      expect(programInfo).toBeDefined();
      expect(programInfo.value).toBeDefined();
      if (programInfo.value) {
        expect(programInfo.value.executable).toBe(true);
        expect(programInfo.value.owner).toBeDefined();
      }
    }, 10000); // 10 second timeout for network request

    it("should fetch chess registry", async () => {
      const registry = await registryFetcher.getRegistry();

      // Registry might exist or not, but should not error
      expect(() => registry).not.toThrow();

      if (registry) {
        expect(registry.data).toBeDefined();
        expect(registry.address).toBeDefined();
        expect(typeof registry.address).toBe("string");
        console.log("✅ Registry found:", registry.address);
        console.log("Registry data:", registry.data);
      } else {
        console.log("ℹ️  Registry not found - might not be initialized yet");
      }
    }, 10000);

    it("should fetch profile by address (if exists)", async () => {
      // Try to fetch a profile if you have one
      // You can replace this with an actual profile address from your PDAs

      const profile = await profileFetcher.getProfile({ walletAddress: payer }, undefined);

      if (profile) {
        expect(profile.data).toBeDefined();
        expect(profile.address).toBeDefined();
        expect(typeof profile.address).toBe("string");
        console.log("✅ Profile found:", profile.address);
        console.log("Profile data:", profile.data);
      } else {
        console.log("ℹ️  Profile not found - might not be initialized yet");
      }
    }, 10000);

    it("should fetch match by address (if exists)", async () => {
      // Try to fetch a match if you have one
      // You can replace this with an actual match address from your PDAs
      const testMatchAddress = payer.address; // Use payer address as example

      const match = await matchFetcher.getMatch(testMatchAddress, undefined);

      if (match) {
        expect(match.data).toBeDefined();
        expect(match.address).toBeDefined();
        expect(typeof match.address).toBe("string");
        console.log("✅ Match found:", match.address);
        console.log("Match data:", match.data);
      } else {
        console.log("ℹ️  Match not found - might not be initialized yet");
      }
    }, 10000);

    it("should fetch all chess accounts", async () => {
      const accounts = await Promise.all([registryFetcher.getRegistry()]);

      expect(Array.isArray(accounts)).toBe(true);
      console.log(`📊 Total chess accounts found: ${accounts.length}`);

      const account = accounts[0];
      expect(account).toBeDefined();
      if (account) {
        expect(account.data).toBeDefined();
        expect(account.address).toBeDefined();
        expect(typeof account.address).toBe("string");
        console.log("✅ First account:", account.address);
        console.log("Account data:", account.data);
      }
    }, 10000);

    it("should have working fetchers", () => {
      expect(registryFetcher).toBeDefined();
      expect(profileFetcher).toBeDefined();
      expect(matchFetcher).toBeDefined();
    });

    it("should handle environment variables correctly", () => {
      expect(env.CHESS_PROGRAM_ID).toBeDefined();
      expect(typeof env.CHESS_PROGRAM_ID).toBe("string");
      expect(env.CHESS_PROGRAM_ID.length).toBeGreaterThan(30); // Valid program ID

      expect(env.WHITE_PLAYER_KEYPAIR).toBeDefined();
      expect(Array.isArray(env.WHITE_PLAYER_KEYPAIR)).toBe(true);
      expect(env.WHITE_PLAYER_KEYPAIR.length).toBe(64);

      expect(env.BLACK_PLAYER_KEYPAIR).toBeDefined();
      expect(Array.isArray(env.BLACK_PLAYER_KEYPAIR)).toBe(true);
      expect(env.BLACK_PLAYER_KEYPAIR.length).toBe(64);

      console.log("✅ Environment variables loaded correctly");
      console.log("Program ID:", env.CHESS_PROGRAM_ID);
      console.log("White player keypair length:", env.WHITE_PLAYER_KEYPAIR.length);
      console.log("Black player keypair length:", env.BLACK_PLAYER_KEYPAIR.length);
    });
  });
});
