import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const _cookies = await cookies(); // Get cookies

    const accessToken = _cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, data: { error: "Unauthorized: No access token" } },
        { status: 401 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/events`;

    const rawResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const { data, status } = rawResponse;
    return NextResponse.json({ success: true, data }, { status });
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
