import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const _cookies = await cookies();
  const url = `${process.env.BASE_URL}/auth/login`;
  console.log("sss", url);

  try {
    const response = await axios.post(url, { email, password });
    const { data, status } = response;

    if (data?.status === 200) {
      // Set cookies only if the user is verified
      if (data?.result?.isVerified) {
        _cookies.set("isAuthenticated", "true", {
          maxAge: 30 * 86400,
          path: "/",
          sameSite: "strict",
        });

        _cookies.set("access_token", data.result.access_token, {
          maxAge: 30 * 86400,
          path: "/",
          sameSite: "strict",
        });

        if (data.result.refresh_token) {
          _cookies.set("refresh_token", data.result.refresh_token, {
            maxAge: 30 * 86400,
            path: "/",
            sameSite: "strict",
            httpOnly: true,
          });
        }
      }
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
