import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email } = await request.json();
  const url = `${process.env.BASE_URL}/auth/forgot-password`;
  const _cookies = await cookies();

  try {
    const response = await axios.post(url, { email });
    const { data, status } = response;

    if (data?.status === 200) {
      _cookies.set("access_token", data.access_token, {
        maxAge: 30 * 86400,
        path: "/",
        sameSite: "strict",
      });
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
