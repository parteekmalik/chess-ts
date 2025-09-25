// Profile-specific tests

import type { KeyPairSigner } from "gill";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { createKeyPairSignerFromBytes, createSolanaClient } from "gill";

import { env } from "../../env";
import { getProfilePda, profileFetcher } from "./index";

const client = createSolanaClient({ urlOrMoniker: "devnet" });
describe("Profile Tests", () => {
  let payer: KeyPairSigner;

  beforeAll(async () => {
    // Create real keypair
    const keypairArray = env.WHITE_PLAYER_KEYPAIR;
    expect(keypairArray).toBeDefined();
    expect(keypairArray.length).toBe(64);
    payer = await createKeyPairSignerFromBytes(new Uint8Array(keypairArray));
  });

  describe("Profile PDA", () => {
    it("should derive profile PDA correctly", async () => {
      const profilePda = await getProfilePda(payer.address);

      expect(profilePda).toBeDefined();
      expect(typeof profilePda).toBe("string");
      expect(profilePda.length).toBeGreaterThan(30); // Valid address length

      console.log("✅ Profile PDA:", profilePda);
    });
  });

  describe("Profile Fetcher", () => {
    it("should fetch profile by wallet address", async () => {
      const profile = await profileFetcher.getProfile(payer.address, client.rpc);

      expect(profile).toBeDefined();

      console.log("Profile: ", profile);
      expect(profile.address).toBeDefined();
    });

    it("should fetch profile by address", async () => {
      // First get the PDA
      const profilePda = await getProfilePda(payer.address);

      expect(profilePda).toBeDefined();
      expect(typeof profilePda).toBe("string");
      const profile = await profileFetcher.getProfile(profilePda, client.rpc);

      expect(profile).toBeDefined();

      expect(profile.address).toBe(profilePda);
    });

    it("should handle missing wallet address", async () => {
      const profile = await profileFetcher.getProfile(payer.address, client.rpc);

      expect(profile).toBeNull();
    });
  });
});
