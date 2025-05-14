import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // 1. Input Validation
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    // MongoDB ID format example
    return NextResponse.json(
      { success: false, error: "Invalid event ID format" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" }, // Prevent caching of errors
      }
    );
  }

  // 2. Authentication (synchronous cookie check)
  const _cookies = await cookies(); // No need for await, cookies() is synchronous

  const accessToken = _cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Authorization token required" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
          "WWW-Authenticate": "Bearer", // Standard auth header
        },
      }
    );
  }

  try {
    // 3. API Call with Safety Measures
    const url = `${process.env.BASE_URL}/calendar/details/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache", // Forward cache policy to upstream
      },
      timeout: 10000, // 10-second timeout
      validateStatus: () => true, // Handle all status codes
    });

    // 4. Handle Upstream Errors
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
          // Optional metadata
          fetchedAt: new Date().toISOString(),
        },
      },
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Browser caching
          "Netlify-CDN-Cache-Control": "no-store", // Netlify-specific
          "CDN-Cache-Control": "no-store", // Broad CDN compliance
        },
      }
    );
  } catch (err: unknown) {
    // 5. Enhanced Error Handling
    console.error(`[Event API] Error fetching ${id}:`, err);

    // Axios-specific errors
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Service unavailable",
          code: err.code, // Include error code (e.g., ECONNABORTED)
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
