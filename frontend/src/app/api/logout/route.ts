import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Set environment variable to bypass certificate validation if needed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET() {
  // Removed unused req parameter
  const _cookies = await cookies(); // cookies() is synchronous, no need for await

  try {
    // List of all cookies to remove
    const cookiesToRemove = ["isAuthenticated", "access_token"];

    // Remove all specified cookies from server-side
    cookiesToRemove.forEach((cookieName) => {
      _cookies.delete(cookieName);
    });

    // Prepare the successful response
    const response = NextResponse.json(
      {
        success: true,
        message: "User logged out successfully.",
      },
      { status: 200 }
    );

    // Clear cookies in the response (client-side)
    cookiesToRemove.forEach((cookieName) => {
      response.cookies.set({
        name: cookieName,
        value: "",
        expires: new Date(0), // Expire immediately
        path: "/",
        // httpOnly: true,  // Recommended for production
        // secure: process.env.NODE_ENV === "production",  // Recommended for production
        sameSite: "lax",
      });
    });

    return response;
  } catch (err) {
    console.error("Error during logout process:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during logout.",
      },
      { status: 500 }
    );
  }
}
