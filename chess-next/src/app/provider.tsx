"use client";

import { NextUIProvider } from "@nextui-org/react";
import type { ReactNode } from "react";
import PageContextComponent from "~/components/contexts/page/PageContextComponent";

function Provider({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <PageContextComponent>{children}</PageContextComponent>
    </NextUIProvider>
  );
}

export default Provider;
