import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* L'hébergement Infomaniak annonce 28 cœurs mais limite la mémoire :
     un worker par cœur fait tuer le build. On en limite le nombre. */
  experimental: {
    cpus: 2,
  },
  /* Le tennis et le pickleball sont présentés sur la page padel. */
  async redirects() {
    return [
      { source: "/tennis", destination: "/padel#tennis", permanent: true },
      { source: "/pickleball", destination: "/padel#pickleball", permanent: true },
    ];
  },
};

export default nextConfig;
