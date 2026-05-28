import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Refresh Supabase session cookies.
  const response = await updateSession(request);

  // Light guard for /account/* and /admin/* — full role check happens in the
  // page (we can't easily await Supabase here at the edge without an extra
  // round trip; the route still server-checks).
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/account") || pathname.startsWith("/admin")) {
    // We can't read the user from cookies cheaply here, so this is mostly a
    // hook for future logic (e.g. read a verified JWT claim). For now we let
    // the page do the auth check on the server.
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image, favicon, brand/, products/  (static)
     * - api routes (handled inside)
     */
    "/((?!_next/static|_next/image|favicon|brand|products|api|.*\\..*).*)",
  ],
};
