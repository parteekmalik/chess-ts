import type { DefaultSession, NextAuthConfig, Session as NextAuthSession } from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

import { db } from "@acme/db/client";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rating: number;
    } & DefaultSession["user"];
  }
}
const adapter = PrismaAdapter(db);

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
  adapter,
  // session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [Discord, Google],
  callbacks: {
    session: async (opts) => {
      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
          rating: (await db.user.findUnique({ where: { id: opts.user.id } }))?.rating ?? 1200,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (token: string): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
          id: session.user.id,
          rating: (await db.user.findUnique({ where: { id: session.user.id } }))?.rating ?? 1200,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
