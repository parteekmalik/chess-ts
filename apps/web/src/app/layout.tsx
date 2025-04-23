import type { Metadata } from "next";
import type { Session } from "next-auth";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TRPCReactProvider } from "src/trpc/react";

import { env } from "~/env";
import { Providers } from "./providers";

import "~/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.VERCEL_ENV === "production" ? "https://turbo.t3.gg" : "http://localhost:3000"),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const runtime = "nodejs";

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <Analytics />
          <SpeedInsights />
          <Providers session={session}>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
