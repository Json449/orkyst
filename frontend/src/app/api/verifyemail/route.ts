import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { access_token, code } = body; // Destructure properly
    // Validate input
    if (!access_token) {
      return NextResponse.json(
        {
          success: false,
          data: { error: "Unauthorized: No access token provided" },
        },
        { status: 401 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, data: { error: "Invalid verification code" } },
        { status: 400 }
      );
    }

    const payload = {
      code: code, // Just send the code, backend should already have user context
    };

    const url = `${process.env.BASE_URL}/auth/verify-email`;

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("axios:", err.response?.data);
      return NextResponse.json(err.response?.data);
    }
  }
}
