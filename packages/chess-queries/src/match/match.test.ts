// Match-specific tests

import type { Address, KeyPairSigner, SolanaClient } from "gill";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { createKeyPairSignerFromBytes, createSolanaClient } from "gill";

import { env } from "../../env";
import { getMatchPda, matchFetcher } from "./index";

describe("Match Tests", () => {
  let payer: KeyPairSigner;
  let client: SolanaClient;

  beforeAll(async () => {
    // Create real keypair
    const keypairArray = env.WHITE_PLAYER_KEYPAIR;
    expect(keypairArray).toBeDefined();
    expect(keypairArray.length).toBe(64);
    payer = await createKeyPairSignerFromBytes(new Uint8Array(keypairArray));

    // Create real Solana client
    client = createSolanaClient({ urlOrMoniker: "devnet" });
  });

  describe("Match PDA", () => {
    it("should derive match PDA correctly", async () => {
      const matchId = 12345;
      const matchPda = await getMatchPda(matchId);

      expect(matchPda).toBeDefined();
      expect(matchPda[0]).toBeDefined();
      expect(matchPda[1]).toBeDefined();
      expect(typeof matchPda[0]).toBe("string");
      expect(typeof matchPda[1]).toBe("number");
      expect(matchPda[0].length).toBeGreaterThan(30); // Valid address length

      console.log("✅ Match PDA:", matchPda[0]);
      console.log("✅ Match Bump:", matchPda[1]);
    });

    it("should derive different PDAs for different match IDs", async () => {
      const matchId1 = 11111;
      const matchId2 = 22222;

      const matchPda1 = await getMatchPda(matchId1);
      const matchPda2 = await getMatchPda(matchId2);

      expect(matchPda1[0]).not.toBe(matchPda2[0]);
      console.log("✅ Different match IDs produce different PDAs");
    });
  });

  describe("Match Fetcher", () => {
    it("should fetch match by address", async () => {
      // Use a test address (payer address as example)
      const testMatchAddress = payer.address;

      const match = await matchFetcher.getMatch(testMatchAddress, client.rpc);

      expect(match).toBeDefined();

        console.log("✅ Match found:", match.address);
        console.log("Match data:", match);
        expect(match).toBeDefined();
        expect(match.address).toBeDefined();
        expect(typeof match.address).toBe("string");
    });

    it("should get match PDA", async () => {
      const matchId = 54321;
      const matchPda = await matchFetcher.getMatchPda(matchId);

      expect(matchPda).toBeDefined();
      expect(matchPda[0]).toBeDefined();
      expect(matchPda[1]).toBeDefined();
    });

    it("should handle invalid match address", async () => {
      const invalidAddress = "invalid-address";
      const match = await matchFetcher.getMatch(invalidAddress as Address, client.rpc);

      expect(match).toBeNull();
    });
  });
});
