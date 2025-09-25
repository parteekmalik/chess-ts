import { readFileSync } from "fs";
import { webcrypto } from "node:crypto";
import { join } from "path";
import { jest } from "@jest/globals";

// Add crypto polyfill for Node.js
global.crypto = webcrypto as Crypto;

// Load environment variables from root .env file
try {
  const envPath = join(__dirname, "../../../.env");
  const envFile = readFileSync(envPath, "utf8");

  envFile.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim();
      if (value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  console.log("Could not load .env file:", error);
}

// Mock the env module to use the loaded environment variables
jest.mock("../env", () => ({
  env: {
    get CHESS_PROGRAM_ID(): string {
      return process.env.CHESS_PROGRAM_ID!;
    },
    get WHITE_PLAYER_KEYPAIR(): number[] {
      const data = process.env.WHITE_PLAYER_KEYPAIR;
      return data ? (JSON.parse(data) as number[]) : [];
    },
    get BLACK_PLAYER_KEYPAIR(): number[] {
      const data = process.env.BLACK_PLAYER_KEYPAIR;
      return data ? (JSON.parse(data) as number[]) : [];
    },
    get NODE_ENV(): string {
      return process.env.NODE_ENV ?? "development";
    },
  },
}));

// Mock @wallet-ui/react module
jest.mock("@wallet-ui/react", () => ({
  useWalletUi: () => ({
    client: {
      rpc: {
        getAccountInfo: jest.fn(),
        getProgramAccounts: jest.fn(),
      },
    },
    cluster: {
      id: "devnet",
    },
    account: null,
  }),
}));
