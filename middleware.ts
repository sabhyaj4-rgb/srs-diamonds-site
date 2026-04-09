import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle this flag when you want to show maintenance mode.
const MAINTENANCE_MODE = true;

const LIVE_PAGE_PATH = "/SRS_Diamonds_v16.html";
const MAINTENANCE_PAGE_PATH = "/maintenance.html";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip framework/static routes.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Keep the public URL clean: serve the site from root "/".
  if (pathname === "/") {
    const target = MAINTENANCE_MODE ? MAINTENANCE_PAGE_PATH : LIVE_PAGE_PATH;
    return NextResponse.rewrite(new URL(target, request.url));
  }

  // Prevent exposing internal page paths in normal browsing.
  if (!MAINTENANCE_MODE && pathname === MAINTENANCE_PAGE_PATH) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (MAINTENANCE_MODE && pathname === LIVE_PAGE_PATH) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

