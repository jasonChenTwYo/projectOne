/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  rewrites: async () => {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/:path*",
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
    return [
      {
        source: "/docs",
        destination: "http://backend:8000/docs",
      },
    ];
  },
};

export default nextConfig;
