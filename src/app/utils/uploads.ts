export function getPublicUploadUrl(objectKey: string | null | undefined) {
  if (!objectKey) return "";
  const baseUrl = process.env.NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL;
  if (!baseUrl) return `/uploads/${objectKey}`;
  return `${baseUrl.replace(/\/$/, "")}/uploads/${objectKey}`;
}

