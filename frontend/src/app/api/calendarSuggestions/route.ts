import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // 1. Input Validation
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    // MongoDB ID format validation
    return NextResponse.json(
      { success: false, error: "Invalid ID format" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "Netlify-CDN-Cache-Control": "no-store",
        },
      }
    );
  }

  // 2. Authentication (synchronous)
  const _cookies = await cookies();
  const accessToken = _cookies.get("access_token")?.value;
  if (!accessToken || !isValidJWT(accessToken)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing token" },
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
    // 3. API Call with Cache Prevention
    const url = `${process.env.BASE_URL}/calendar/suggestions/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache", // Forward to upstream
        "X-Request-ID": Date.now().toString(), // Cache buster
      },
      timeout: 8000, // 8-second timeout
      validateStatus: () => true, // Handle all status codes
    });

    // 4. Handle Upstream Errors
    if (response.status >= 400) {
      throw new Error(
        response.data?.message || `Upstream error: ${response.status}`
      );
    }

    // 5. Success Response
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
          Vary: "*",
        },
      }
    );
  } catch (err: unknown) {
    // 6. Enhanced Error Handling
    console.error(`[Suggestions API] ID: ${id}`, err);

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

// Basic JWT format validation
function isValidJWT(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
}
