import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    unoptimized: true,
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      // Add your backend domain if serving images
    ],
  },

  // API proxy rewrites to avoid CORS
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`, // Ensure NEXT_PUBLIC_BASE_URL is set in .env file
      },
    ];
  },

  // Server configuration
  experimental: {
    optimizeCss: false,
    optimizeServerReact: false,
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        process.env.NEXT_PUBLIC_BASE_URL, // Ensure this is set correctly
        "http://localhost:3000",
        "https://orkyst.netlify.app",
      ],
    },
  },

  // Security headers (optional)
  async headers() {
    return [
      {
        source: "/backend/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Or specific domains
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
