import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "https://api-admin-crm.deltatradinghub.com",
      "api-admin-crm.deltatradinghub.com",
      "api-crm.deltatradinghub.com",
      "pub-33aa3bdc8cd54214991d18e5d443a35e.r2.dev",
      "pub-33aa3bdc8cd54214991d18e5d443a35e.r2.dev",
      "https://pub-33aa3bdc8cd54214991d18e5d443a35e.r2.dev",
    ],
  },

  // ─── API Proxy ────────────────────────────────────────────────────────────
  // All browser calls go to /proxy/api/... (same origin).
  // Next.js rewrites them server-side to the real backend URL.
  // The backend URL is NEVER sent to the browser.
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
