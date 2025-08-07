"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

export function NotFoundContent() {
  return (
    <Card className="mx-auto w-fit bg-background">
      <CardContent className="mx-10 flex flex-col items-center gap-4">
        <h2 className="w-full border-b border-white/20 pb-4 text-center text-3xl font-bold">404 Page not Found</h2>
        <Link href={"/"} className={cn(buttonVariants({ variant: "outline" }), "h-10 bg-white/10 py-2 hover:bg-white/5")}>
          Return Home
        </Link>
        <Image src="https://www.chess.com/bundles/web/images/404-pawn.f17f262c.gif" alt="error image" width={420} height={420} className="mt-2" />
      </CardContent>
    </Card>
  );
}
