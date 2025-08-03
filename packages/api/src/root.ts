import { authRouter } from "./router/auth";
import { liveGameRouter } from "./router/live";
import { puzzleRouter } from "./router/puzzle";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  puzzle: puzzleRouter,
  liveGame: liveGameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
