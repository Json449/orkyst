// middleware.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { decodeToken } from "./utils";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  // Set CORS headers to allow all origins (use '*' for wildcard)
  requestHeaders.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  requestHeaders.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  requestHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  requestHeaders.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: requestHeaders,
    });
  }

  // 1. Skip CORS for API routes (handled by Next.js proxy)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Authentication logic for protected routes
  const publicPaths = ["/", "/signup"];
  const _cookies = await cookies();
  const accessTokenFromCookie = _cookies.get("access_token")?.value;
  console.log("accessTokenFromCookie", accessTokenFromCookie);

  if (accessTokenFromCookie) {
    try {
      const payload: any = await decodeToken(accessTokenFromCookie);
      console.log("data nowwwws", payload);
      if (payload?.access) {
        if (publicPaths.includes(pathname)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next({
          request: { headers: requestHeaders },
        });
      }
    } catch (error) {
      console.log("errorrss", error);
    }
  }

  // 3. Final response with CORS headers
  const response = !publicPaths.includes(pathname)
    ? NextResponse.redirect(new URL("/", req.url))
    : NextResponse.next();

  // Ensure CORS headers are set for non-public paths
  response.headers.set("Access-Control-Allow-Origin", "*");
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
