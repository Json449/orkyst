import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

// API route to fetch event by ID
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    const _cookies = await cookies(); // cookies() is synchronous, no need for await
    const accessToken = _cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/event/suggestion/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status }
    );
  } catch (err) {
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
