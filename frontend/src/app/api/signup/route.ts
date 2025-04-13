import { NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";

export async function POST(request: Request) {
  // Destructure the request body
  const { email, password, fullname } = await request.json();

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
    // Check if login is successful
    if (response?.data?.status == HttpStatusCode.Created) {
      // Set cookies with the access token and other user details
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
