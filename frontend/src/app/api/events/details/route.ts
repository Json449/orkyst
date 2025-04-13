import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

// API route to fetch event by ID
export async function GET(req: NextRequest) {
  // Removed unused 'res' parameter
  const id = req.nextUrl.searchParams.get("id");

  try {
    const _cookies = await cookies(); // cookies() is synchronous, no need for await
    const accessToken = _cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No access token" }, // Consistent error format
        { status: 401 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/events/details/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(
      { success: true, data: response.data }, // Directly use response properties
      { status: response.status }
    );
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
