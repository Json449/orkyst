import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const _cookies = await cookies();

    const body = await request.json(); // Get request body
    // Retrieve the access token from cookies
    const access_token = body.access_token;
    if (!access_token.access_token) {
      return NextResponse.json(
        { success: false, data: { error: "Unauthorized: No access token" } },
        { status: 401 }
      );
    }
    _cookies.set("isAuthenticated", "true", {
      maxAge: 30 * 86400,
      path: "/",
      sameSite: "strict",
    });

    _cookies.set("access_token", access_token.access_token, {
      maxAge: 30 * 86400,
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);

    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Error processing request",
        },
        { status: err.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
