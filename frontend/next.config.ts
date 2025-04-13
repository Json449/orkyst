import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Example config
  swcMinify: true, // Enable SWC minification (faster than Terser)
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      // You can add more domains here if necessary
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set a specific body size limit for server actions
      allowedOrigins: ["*"], // Allow all origins (you can customize this as needed)
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Adjust this limit based on your needs (e.g., 10MB)
    },
  },
};

export default nextConfig;
