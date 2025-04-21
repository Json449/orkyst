// middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/signup"];

  const _cookies = await cookies();
  const accessTokenFromCookie = _cookies.get("access_token")?.value;
  if (accessTokenFromCookie) {
    try {
      // Verify the access token using jose
      const secret = new TextEncoder().encode("your_secret_key");
      const tokenToVerify = accessTokenFromCookie;
      await jwtVerify(tokenToVerify, secret);

      // If the token is valid, redirect to /dashboard
      if (publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      const requestHeaders = new Headers(req.headers);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "JWTExpired") {
        // Attempt to refresh the access token
        const refreshToken = _cookies.get("refresh_token")?.value;
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            // Set the new access token in the response headers and cookies
            const response = NextResponse.next();
            response.headers.set("Authorization", `Bearer ${newAccessToken}`);
            _cookies.set("access_token", newAccessToken, {
              maxAge: 30 * 86400, // 30 days
              path: "/",
              sameSite: "strict",
            });
            return response;
          }
        }
      }

      // If token is invalid or refresh fails, allow access to public paths
      if (!publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  // If no valid token is found and the path is not public, redirect to login
  if (!publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow access to public paths if no valid token is found
  return NextResponse.next();
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

async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const response = await fetch(
      "http://your-nestjs-api.com/auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
  }
  return null;
}
