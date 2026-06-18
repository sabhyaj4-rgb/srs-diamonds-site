import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle this flag when you want to show maintenance mode.
const MAINTENANCE_MODE = false;

const MAINTENANCE_PAGE_PATH = "/maintenance.html";
// Old monolithic single-file site(s); now superseded by real routes.
const LEGACY_PAGE_PATHS = ["/SRS_Diamonds_v16.html", "/SRS_Diamonds_v15.html"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip framework/static routes.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Maintenance mode: send every page to the maintenance notice.
  if (MAINTENANCE_MODE) {
    if (pathname !== MAINTENANCE_PAGE_PATH) {
      return NextResponse.rewrite(new URL(MAINTENANCE_PAGE_PATH, request.url));
    }
    return NextResponse.next();
  }

  // Don't expose the maintenance page during normal operation.
  if (pathname === MAINTENANCE_PAGE_PATH) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect the retired single-file pages to the new home route.
  if (LEGACY_PAGE_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Everything else is handled by Next.js routing.
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
