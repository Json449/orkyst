import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // 1. Input Validation
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    // Example: MongoDB ID validation
    return NextResponse.json(
      { success: false, error: "Invalid event ID format" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 2. Authentication
  const _cookies = await cookies(); // cookies() is synchronous, no need for await

  const accessToken = _cookies.get("access_token")?.value;
  if (!accessToken || !isValidJWT(accessToken)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized or invalid token" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
          "WWW-Authenticate": "Bearer",
        },
      }
    );
  }

  try {
    // 3. API Call with Timeout
    const url = `${process.env.BASE_URL}/calendar/events/details/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache", // Forward cache policy to upstream
      },
      timeout: 8000, // 8-second timeout
      validateStatus: () => true, // Handle all status codes without throwing
    });

    // 4. Response Handling
    if (response.status >= 400) {
      throw new Error(
        response.data?.message || `Upstream error: ${response.status}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        meta: {
          // Optional: Add response metadata
          fetchedAt: new Date().toISOString(),
          source: "upstream-api",
        },
      },
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Netlify-CDN-Cache-Control": "no-store", // Critical for Netlify
          "CDN-Cache-Control": "no-store", // Additional CDN header
        },
      }
    );
  } catch (err) {
    // 5. Enhanced Error Handling
    console.error(`[EVENT-API] Error fetching event ${id}:`, err);

    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Upstream service unavailable",
          code: err.code, // Include error code (e.g., ECONNABORTED)
        },
        {
          status: err.response?.status || 503,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

// Helper function for JWT validation (basic format check)
function isValidJWT(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
}
