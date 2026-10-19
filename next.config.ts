import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Le tennis et le pickleball sont présentés sur la page padel. */
  async redirects() {
    return [
      { source: "/tennis", destination: "/padel#tennis", permanent: true },
      { source: "/pickleball", destination: "/padel#pickleball", permanent: true },
    ];
  },
};

export default nextConfig;
