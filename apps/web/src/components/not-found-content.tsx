"use client";

import Link from "next/link";

import { Button } from "@acme/ui/button";

export function NotFoundContent() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404 - Not Found</h2>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Go to Home Page</Link>
        </Button>
      </div>
    </div>
  );
}
