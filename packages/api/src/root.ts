import { authRouter } from "./router/auth";
import { puzzleRouter } from "./router/puzzle";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  puzzle: puzzleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
