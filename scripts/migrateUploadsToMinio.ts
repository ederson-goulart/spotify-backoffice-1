import fs from "node:fs/promises";
import path from "node:path";
import minio from "../lib/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.MINIO_BUCKET || "uploads";

function contentTypeFromExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  let entries: string[];
  try {
    entries = await fs.readdir(uploadsDir);
  } catch (e) {
    console.error(`Uploads directory not found: ${uploadsDir}`);
    console.error(
      "If you don't have legacy files to migrate, you can ignore this script.",
    );
    process.exitCode = 1;
    return;
  }

  const files = entries.filter((name) => !name.startsWith("."));
  if (files.length === 0) {
    console.log(`No files found in ${uploadsDir}. Nothing to migrate.`);
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const fileName of files) {
    const fullPath = path.join(uploadsDir, fileName);

    try {
      const stat = await fs.stat(fullPath);
      if (!stat.isFile()) continue;

      const body = await fs.readFile(fullPath);
      const contentType = contentTypeFromExt(path.extname(fileName));

      await minio.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: fileName,
          Body: body,
          ContentType: contentType,
          ACL: "public-read",
        }),
      );

      ok++;
      console.log(`OK  ${fileName}`);
    } catch (e) {
      failed++;
      console.error(`ERR ${fileName}`, e);
    }
  }

  console.log(`Done. Uploaded: ${ok}, failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exitCode = 1;
});

