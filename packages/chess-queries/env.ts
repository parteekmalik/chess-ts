import { createEnv } from "@t3-oss/env-nextjs";
import { address } from "gill";
import { z } from "zod";

// Use IDL-based program ID as fallback
import { getWeb3ProgramIdAsAddress } from "@acme/anchor";

const getProgramId = () => {
  if (process.env.CHESS_PROGRAM_ID) {
    return address(process.env.CHESS_PROGRAM_ID);
  }
  return getWeb3ProgramIdAsAddress();
};

export const env = createEnv({
  server: {
    CHESS_PROGRAM_ID: z
      .string()
      .optional()
      .transform((str) => (str ? address(str) : getWeb3ProgramIdAsAddress())),
    WHITE_PLAYER_KEYPAIR: z.string().transform((str) => JSON.parse(str) as number[]),
    BLACK_PLAYER_KEYPAIR: z.string().transform((str) => JSON.parse(str) as number[]),
    NODE_ENV: z.enum(["development", "production"]).optional().default("development"),
  },
  client: {},
  experimental__runtimeEnv: {
    CHESS_PROGRAM_ID: getProgramId(),
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
