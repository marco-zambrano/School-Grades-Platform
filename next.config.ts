import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The in-process API works reliably with the project TypeScript version.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
