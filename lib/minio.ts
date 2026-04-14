import { S3Client } from "@aws-sdk/client-s3";

function createClient() {
  const endpoint = process.env.MINIO_ENDPOINT_INTERNAL;
  const accessKeyId = process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = process.env.MINIO_SECRET_KEY;

  if (!endpoint) throw new Error("Missing env: MINIO_ENDPOINT_INTERNAL");
  if (!accessKeyId) throw new Error("Missing env: MINIO_ACCESS_KEY");
  if (!secretAccessKey) throw new Error("Missing env: MINIO_SECRET_KEY");

  return new S3Client({
    endpoint,
    region: process.env.MINIO_REGION || "us-east-1",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  });
}

const globalForMinio = global as unknown as { minio?: S3Client };
const minio = globalForMinio.minio ?? createClient();

if (process.env.NODE_ENV !== "production") globalForMinio.minio = minio;

export default minio;
