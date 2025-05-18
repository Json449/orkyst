import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();
  const _cookies = await cookies();
  const access_token = _cookies.get("access_token")?.value;
  const url = `${process.env.BASE_URL}/auth/reset-password`;
  try {
    if (!access_token) {
      return NextResponse.json(
        {
          success: false,
          data: { error: "Unauthorized: No access token provided" },
        },
        { status: 401 }
      );
    }
    const response = await axios.post(
      url,
      { newPassword: password },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { data, status } = response;

    if (data?.status === 200) {
      // Set cookies only if the user is verified
      return NextResponse.json({ success: true, data }, { status });
    }

    return NextResponse.json(
      {
        success: false,
        data: { error: "Please check your Username and Password" },
      },
      { status: 404 }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error:
              err.response?.data?.message ||
              "Please check your Username and Password",
          },
        },
        { status: err.response?.status ?? 500 }
      );
    }

    console.error("Error in login request:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
