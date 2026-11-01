import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  output: 'export',
  // Static export has no image optimisation server; make that explicit instead
  // of relying on every <Image> consumer passing `unoptimized`.
  images: { unoptimized: true },
};

export default nextConfig;
