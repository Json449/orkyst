import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // Get jobId from query parameters
  const jobId = req.nextUrl.searchParams.get("jobId");

  // Get access token from Authorization header
  const _cookies = await cookies();
  const access_token = _cookies.get("access_token")?.value;

  try {
    // Validate required parameters
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    if (!access_token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No access token provided" },
        { status: 401 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/job-status/${jobId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true, // Ensure all responses are passed to the caller
    });
    const { data, status } = response;
    console.log("view nowsss", data);
    if (data?.status === "completed") {
      _cookies.set("access_token", data.access_token, {
        maxAge: 30 * 86400,
        path: "/",
        sameSite: "strict",
      });
      // Set cookies only if the user is verified
      return NextResponse.json({ success: true, data }, { status });
    }

    // Forward the exact response from the backend
    return NextResponse.json(
      {
        success: response.status < 400,
        data: response.data,
        error: response.status >= 400 ? response.data?.message : undefined,
      },
      { status: response.status }
    );
  } catch (err) {
    console.error("API Error:", err);

    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Error processing request",
          details: err.response?.data?.details,
        },
        { status: err.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
