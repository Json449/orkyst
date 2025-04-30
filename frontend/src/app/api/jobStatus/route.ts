import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  // Get jobId from query parameters
  const jobId = req.nextUrl.searchParams.get("jobId");

  // Get access token from Authorization header
  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

  console.log("Request details:", accessToken);

  try {
    // Validate required parameters
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No access token provided" },
        { status: 401 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/job-status/${jobId}`;
    console.log("Forwarding request to:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true, // Ensure all responses are passed to the caller
    });

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
