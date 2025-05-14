import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const _cookies = await cookies();
    const accessToken = _cookies.get("access_token")?.value;

    // Validate token
    if (
      !accessToken ||
      !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(accessToken)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing token" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/list`;
    const rawResponse = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });

    return NextResponse.json(
      { success: true, data: rawResponse.data },
      {
        status: rawResponse.status,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          "Netlify-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "API request failed",
        },
        {
          status: err.response?.status || 500,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
