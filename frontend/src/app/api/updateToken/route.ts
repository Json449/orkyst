import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const _cookies = await cookies();
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"
  console.log("accesss", accessToken);
  try {
    _cookies.set("isAuthenticated", "true", {
      maxAge: 30 * 86400,
      path: "/",
      sameSite: "strict",
    });

    _cookies.set("access_token", accessToken, {
      maxAge: 30 * 86400,
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
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
