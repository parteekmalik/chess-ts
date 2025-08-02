import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "./env";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const cookies = request.headers.get("Cookie") ?? "";
  const response = await fetch(env.AUTH_URL + "/api/auth/session", {
    method: "GET",
    headers: {
      Cookie: cookies,
    },
  });
  const session = (await response.json()) as unknown;

  const publicPaths: string[] = ["/"];
  const isPublicPath = publicPaths.includes(path) || path.startsWith("/api/auth/");

  if(path === "/api/auth/signin" && session) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !session) {
    // If user is not authenticated, store the requested page and redirect to login
    const redirectUrl = new URL("/api/auth/signin", request.nextUrl);
    redirectUrl.searchParams.set("next", path); // Store the originally requested path
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

// Apply middleware to all paths except those starting with "/_next"
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
