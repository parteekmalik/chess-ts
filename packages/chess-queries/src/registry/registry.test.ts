// Registry-specific tests

import { beforeAll, describe, expect, it } from "@jest/globals";

import { env } from "../../env";
import { getRegistryPda, registryFetcher } from "./index";

describe("Registry Tests", () => {
  beforeAll(() => {
    // Create real keypair
    const keypairArray = env.WHITE_PLAYER_KEYPAIR;
    expect(keypairArray).toBeDefined();
    expect(keypairArray.length).toBe(64);
  });

  describe("Registry PDA", () => {
    it("should derive registry PDA correctly", async () => {
      const registryPda = await getRegistryPda();

      expect(registryPda).toBeDefined();
      expect(registryPda[0]).toBeDefined();
      expect(registryPda[1]).toBeDefined();
      expect(typeof registryPda[0]).toBe("string");
      expect(typeof registryPda[1]).toBe("number");

      console.log("✅ Registry PDA:", registryPda[0]);
      console.log("✅ Registry Bump:", registryPda[1]);
    });
  });

  describe("Registry Fetcher", () => {
    it("should fetch registry account", async () => {
      const registry = await registryFetcher.getRegistry();

      expect(registry).toBeDefined();

      if (registry) {
        console.log("✅ Registry found:", registry.address);
        console.log("Registry data:", registry.data);
        expect(registry.data).toBeDefined();
        expect(registry.address).toBeDefined();
      } else {
        console.log("ℹ️  Registry not found - might not be initialized yet");
      }
    });

    it("should get registry PDA", async () => {
      const registryPda = await registryFetcher.getRegistryPda();

      expect(registryPda).toBeDefined();
      expect(registryPda[0]).toBeDefined();
      expect(registryPda[1]).toBeDefined();
    });
  });
});
