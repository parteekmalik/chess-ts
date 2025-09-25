// Utils-specific tests

import { describe, expect, it } from "@jest/globals";

import { env } from "../../env";
import { getChessProgramId, getSolanaClient } from "./index";

describe("Utils Tests", () => {
  describe("Client Utils", () => {
    it("should create Solana client", () => {
      const client = getSolanaClient();

      expect(client).toBeDefined();
      expect(client.rpc).toBeDefined();
      expect(typeof client.rpc.getAccountInfo).toBe("function");
      expect(typeof client.rpc.getProgramAccounts).toBe("function");

      console.log("✅ Solana client created successfully");
    });

    it("should return same client instance (singleton)", () => {
      const client1 = getSolanaClient();
      const client2 = getSolanaClient();

      expect(client1).toBe(client2);
      console.log("✅ Client singleton pattern works correctly");
    });
  });

  describe("Program ID Utils", () => {
    it("should get program ID from environment", () => {
      const programId = getChessProgramId();

      expect(programId).toBeDefined();
      expect(typeof programId).toBe("string");
      expect(programId.length).toBeGreaterThan(30); // Valid program ID length
      expect(programId).toBe(env.CHESS_PROGRAM_ID);

      console.log("✅ Program ID:", programId);
    });
  });

  describe("Environment Variables", () => {
    it("should have required environment variables", () => {
      expect(env.CHESS_PROGRAM_ID).toBeDefined();
      expect(env.WHITE_PLAYER_KEYPAIR).toBeDefined();
      expect(env.BLACK_PLAYER_KEYPAIR).toBeDefined();

      expect(typeof env.CHESS_PROGRAM_ID).toBe("string");
      expect(Array.isArray(env.WHITE_PLAYER_KEYPAIR)).toBe(true);
      expect(Array.isArray(env.BLACK_PLAYER_KEYPAIR)).toBe(true);

      expect(env.WHITE_PLAYER_KEYPAIR.length).toBe(64);
      expect(env.BLACK_PLAYER_KEYPAIR.length).toBe(64);

      console.log("✅ All environment variables are properly configured");
    });
  });
});
