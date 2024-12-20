import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="dark">
        <TRPCReactProvider>
          <Provider session={session}>
            <div className="max-w-screen flex h-full min-h-screen flex-row bg-background-600">
              <Header />
              <div className="max-w-screen flex min-h-screen grow flex-col md:mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
                {children}
                <Footer />
              </div>
            </div>
          </Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
