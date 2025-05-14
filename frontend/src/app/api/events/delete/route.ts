import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const _cookies = await cookies();
  const accessToken = _cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log("asdasdsad123", accessToken);
  try {
    const payload = await request.json();
    console.log("123123", payload);
    const { eventId, ...rest } = payload;
    delete payload.eventId;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const url = `${process.env.BASE_URL}/calendar/events/${eventId}`;
    console.log("123123", url);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: rest, // Axios DELETE sends data in the 'data' property
    };

    const response = await axios.delete(url, config);

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorData = err.response?.data || { error: "Something went wrong" };
      const status = err.response?.status || 500;

      return NextResponse.json(
        { success: false, error: errorData },
        { status }
      );
    }

    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
