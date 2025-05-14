import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  // 1. Authentication (synchronous cookie check)
  const _cookies = await cookies();
  const accessToken = _cookies.get("access_token")?.value;
  if (!accessToken || !isValidJWT(accessToken)) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid access token" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
          "Netlify-CDN-Cache-Control": "no-store",
          "WWW-Authenticate": "Bearer",
        },
      }
    );
  }

  try {
    // 2. API Call with Cache Prevention
    const url = `${process.env.BASE_URL}/calendar/events`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache", // Forward to upstream API
        "X-Request-ID": Date.now().toString(), // Cache buster
      },
      timeout: 10000, // 10-second timeout
      validateStatus: () => true, // Handle all status codes
    });

    // 3. Handle Upstream Errors
    if (response.status >= 400) {
      throw new Error(
        response.data?.message || `Upstream error: ${response.status}`
      );
    }

    // 4. Success Response
    return NextResponse.json(
      {
        success: true,
        data: response.data,
        meta: {
          fetchedAt: new Date().toISOString(),
          cacheStatus: "disabled",
        },
      },
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          "Netlify-CDN-Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          Vary: "*", // Prevent all forms of caching
        },
      }
    );
  } catch (err: unknown) {
    // 5. Enhanced Error Handling
    console.error("[Calendar API]", err);

    // Axios-specific errors
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Service unavailable",
          code: err.code, // ECONNABORTED for timeouts
        },
        {
          status: err.response?.status || 503,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // Generic errors
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Operation failed",
        ...(process.env.NODE_ENV === "development" && {
          stack: err instanceof Error ? err.stack : undefined,
        }),
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

// JWT format validation (basic check)
function isValidJWT(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
}
