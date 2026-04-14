import type { NextConfig } from "next";

function minioRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || "",
      pathname: "/**",
    };
  } catch {
    return undefined;
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  watchOptions: {
    pollIntervalMs: 1000,
  },
  images: {
    remotePatterns: [minioRemotePattern()].filter(Boolean) as NonNullable<
      NextConfig["images"]
    >["remotePatterns"],
  },
};

export default nextConfig;
