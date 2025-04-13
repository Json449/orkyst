// src/app/api/cloudinary/upload/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import crypto from "crypto";

// Define types for Cloudinary upload parameters and response
type CloudinaryUploadParams = {
  timestamp: number;
  upload_preset: string;
  folder?: string;
  signature?: string;
  api_key?: string;
};

type CloudinaryUploadResult = {
  secure_url: string;
  // Add other properties you expect from Cloudinary response
  [key: string]: unknown;
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a signature for signed uploads
const generateSignature = (params: Record<string, string | number>) => {
  const signature = crypto
    .createHash("sha256")
    .update(
      Object.entries(params)
        .sort()
        .map(([key, value]) => `${key}=${value}`)
        .join("&") + process.env.CLOUDINARY_API_SECRET
    )
    .digest("hex");

  return signature;
};

// Handle POST requests
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // Generate a timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Define upload parameters
    const uploadParams: CloudinaryUploadParams = {
      timestamp,
      upload_preset: "calendar_tool",
      folder: "images",
    };

    // Generate the signature
    const signature = generateSignature(uploadParams);

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Cloudinary with signed parameters
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            ...uploadParams,
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
          } as CloudinaryUploadParams,
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error("No result from Cloudinary"));
            } else {
              resolve(result);
            }
          }
        );

        // Create a readable stream from the buffer and pipe it to Cloudinary
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      }
    );

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to upload file to Cloudinary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
