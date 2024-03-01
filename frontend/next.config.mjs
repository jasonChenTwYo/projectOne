/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#good-to-know
  rewrites: async () => {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/auth/:path*",
          destination: "/api/auth/:path*",
        },
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
        {
          source: "/docs",
          destination: "http://127.0.0.1:8000/docs",
        },
        {
          source: "/openapi.json",
          destination: "http://127.0.0.1:8000/openapi.json",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
