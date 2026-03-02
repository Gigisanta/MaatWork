import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@maatwork/ui", "@maatwork/database", "@maatwork/auth", "@maatwork/infra"],
  experimental: {
    turbopack: {
      root: path.join(__dirname, "../../"),
    },
  },
};

export default nextConfig;
