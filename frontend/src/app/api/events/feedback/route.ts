import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Destructure the request body
  const { comment, eventId, text } = await request.json();
  const _cookies = await cookies(); // Get cookies
  const accessToken = _cookies.get("access_token")?.value;

  // Get the cookies handler
  // Construct the URL for the login API
  const url = `${process.env.BASE_URL}/calendar/feedback`;

  // Create the request body
  const body = {
    comment,
    text,
    eventId,
  };

  try {
    // Make the POST request using axios
    const rawResponse = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const { data, status } = rawResponse;

    // Check if login is successful
    if (data?.status === 200 || data?.status == 201) {
      return NextResponse.json({ success: true, data }, { status });
    } else {
      // If login failed, return error response
      return NextResponse.json(
        {
          success: false,
          data: {
            error: "Something went wrong",
          },
        },
        { status: 404 }
      );
    }
  } catch (err) {
    // Log the error details
    if (axios.isAxiosError(err)) {
      // This means the error is an Axios error
      console.error("Axios error:e=====>", err.response?.data);
      return NextResponse.json(
        {
          success: false,
          data: {
            error: err.response?.data?.message || "Something went wrong",
          },
        },
        { status: err.response?.status }
      );
    } else {
      // If it's not an Axios error, log a generic message
      console.error("Error in login request:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
