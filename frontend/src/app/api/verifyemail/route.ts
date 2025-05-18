import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const _cookies = await cookies();
    const access_token = _cookies.get("access_token")?.value;
    const { code } = body; // Destructure properly
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
    const { data, status } = response;
    console.log("data", data);
    if (data?.status === 200) {
      _cookies.set("access_token", data.access_token, {
        maxAge: 30 * 86400,
        path: "/",
        sameSite: "strict",
      });
      // Set cookies only if the user is verified
      return NextResponse.json({ success: true, data }, { status });
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("axios:", err.response?.data);
      return NextResponse.json(err.response?.data);
    }
  }
}
