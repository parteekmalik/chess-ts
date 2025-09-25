"use client";

import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { SocketContextComponent } from "~/components/contexts/socket/SocketContextComponent";
import Footer from "~/components/Footer";
import { Header } from "~/components/Header/header";
import { store } from "~/components/redux/store";

interface ProviderProps {
  children: ReactNode;
  session: Session | null;
}
const footerNotShownPaths = ["/play",'/web3'];
export function Providers({ children, session }: ProviderProps) {
  const path = usePathname();
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <Provider store={store}>
          <SocketContextComponent>
            <main className="max-w-screen relative flex h-full min-h-screen flex-col dark:bg-foreground lg:flex-row">
              <Header />
              <div className="z-0 flex w-full max-w-full grow flex-col lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
                <div className="flex-1">{children}</div>
                {!footerNotShownPaths.find((i) => path.startsWith(i)) && <Footer />}
              </div>
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#2b8a3e",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#e03131",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </SocketContextComponent>
        </Provider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
