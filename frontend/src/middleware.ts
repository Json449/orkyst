// middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  // 1. Handle CORS for all requests (including client-side API calls)
  requestHeaders.set("Access-Control-Allow-Origin", origin);
  requestHeaders.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  requestHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  requestHeaders.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: requestHeaders,
    });
  }

  // 2. Skip CORS for API routes (handled by Next.js proxy)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Authentication logic for protected routes
  const publicPaths = ["/", "/signup"];
  const _cookies = cookies();
  const accessTokenFromCookie = _cookies.get("access_token")?.value;

  if (accessTokenFromCookie) {
    try {
      const secret = new TextEncoder().encode("your_secret_key");
      await jwtVerify(accessTokenFromCookie, secret);

      if (publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      // Your existing error handling...
    }
  }

  // 4. Final response with CORS headers
  const response = !publicPaths.includes(pathname)
    ? NextResponse.redirect(new URL("/", req.url))
    : NextResponse.next();

  // Ensure CORS headers are set
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export const config = {
  matcher: [
    "/eventDetails/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/",
    "/signup",
  ],
};
