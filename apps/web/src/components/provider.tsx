"use client";

import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import SocketContextComponent from "~/components/contexts/socket/SocketContextComponent";

interface ProviderProps {
  children: ReactNode;
  session: Session | null;
}

function Provider({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <SocketContextComponent>
          {children}
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
      </NextUIProvider>
    </SessionProvider>
  );
}

export default Provider;
