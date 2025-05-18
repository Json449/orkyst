import { NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Destructure the request body
  const { email, password, fullname } = await request.json();
  const _cookies = await cookies();
  // Construct the URL for the login API
  const url = `${process.env.BASE_URL}/auth/signup`;

  // Create the request body
  const body = {
    email,
    password,
    fullname,
  };

  try {
    // Make the POST request using axios
    const response = await axios.post(url, body);
    const { data, status } = response;
    // Check if login is successful
    if (status == HttpStatusCode.Created) {
      _cookies.set("access_token", data.access_token, {
        maxAge: 30 * 86400,
        path: "/",
        sameSite: "strict",
      });
      return NextResponse.json(response.data);
    } else {
      // If login failed, return error response
      return NextResponse.json(response.data);
    }
  } catch (err) {
    // Log the error details
    if (axios.isAxiosError(err)) {
      // This means the error is an Axios error
      console.error("Axios error:e=====>", err.response?.data);
      return NextResponse.json(err?.response?.data);
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
