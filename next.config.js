/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The browser calls same-origin /api/*; Next.js forwards it to the
  // ASP.NET Core API (backend/). Set CAMPATH_API_URL in production.
  async rewrites() {
    const apiUrl = process.env.CAMPATH_API_URL ?? "http://localhost:5080";
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

module.exports = nextConfig;
