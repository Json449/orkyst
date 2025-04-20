import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Get request body
    // Retrieve the access token from cookies
    const access_token = body.access_token;
    const _cookies = await cookies();

    if (!access_token.access_token) {
      return NextResponse.json(
        { success: false, data: { error: "Unauthorized: No access token" } },
        { status: 401 }
      );
    }
    delete body.access_token;
    const url = `${process.env.BASE_URL}/users/update_user`;

    // Make the PATCH request with Authorization header
    const rawResponse = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${access_token.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const { data, status } = rawResponse;
    console.log("yahooo now update user check", data?.result);
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
