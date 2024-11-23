import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths: string[] = [];
  const isPublicPath = publicPaths.includes(path) || path.startsWith("/api/auth") || path.startsWith("/api/trpc/");

  const token = request.cookies.get("__Secure-next-auth.session-token")?.value ?? request.cookies.get("next-auth.session-token")?.value;

  if (!isPublicPath && !token) {
    // If user is not authenticated, store the requested page and redirect to login
    const redirectUrl = new URL("/api/auth/signin", request.nextUrl);
    redirectUrl.searchParams.set("next", path); // Store the originally requested path
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

// Apply middleware to all paths except those starting with "/_next"
export const config = {
  matcher: ["/account","/api"],
};
