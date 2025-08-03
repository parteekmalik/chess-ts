import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.number(),
    AUTH_URL: z.string(),
    AUTH_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]).optional().default("development"),
  },
  client: {},
  experimental__runtimeEnv: {
    PORT: Number(process.env.NEXT_PUBLIC_BACKEND_WS?.split(":")[2]),
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
