export function getPublicUploadUrl(objectKey: string | null | undefined) {
  if (!objectKey) return "";
  const baseUrl = process.env.NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("MinIO public base URL not set");
  return `${baseUrl.replace(/\/$/, "")}/uploads/${objectKey}`;
}
