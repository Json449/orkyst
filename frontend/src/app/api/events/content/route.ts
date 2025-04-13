import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  // Destructure the request body
  const { changes, eventId, versionAction } = await request.json();
  const _cookies = await cookies(); // Get cookies
  const accessToken = _cookies.get("access_token")?.value;

  // Construct the URL for the API
  const url = `${process.env.BASE_URL}/calendar/event/`;

  // Create the request body
  const body = {
    changes,
    eventId,
    versionAction,
  };

  try {
    // Make the PUT request using axios
    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const { data, status } = response;

    // Check if the request was successful
    if (status === 200 || status === 201) {
      return NextResponse.json({ success: true, data }, { status });
    } else {
      // If the request failed, return an error response
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong",
        },
        { status: 404 }
      );
    }
  } catch (err) {
    // Log the error details
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || "Something went wrong",
        },
        { status: err.response?.status || 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }
  }
}
