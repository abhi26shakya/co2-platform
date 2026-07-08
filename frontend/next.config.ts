import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxies /api/v1/* to the FastAPI backend.
    // IMPORTANT: rewrite destinations are baked into the build manifest at
    // `next build` time - set BACKEND_URL when BUILDING for production
    // (Vercel project env vars handle this automatically). In `next dev`
    // the config is evaluated at runtime, so a .env.local value works live.
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
