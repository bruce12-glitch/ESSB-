import type { NextConfig } from "next";

// When built by the "Deploy to GitHub Pages" workflow (GITHUB_PAGES=true),
// emit a fully static site under the /ESSB- project-path prefix.
// Everything else (local dev, standalone server scripts) is unchanged.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/ESSB-" : "";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isPages
    ? {
        output: "export",
        images: { unoptimized: true },
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {
        output: "standalone",
      }),
};

export default nextConfig;
