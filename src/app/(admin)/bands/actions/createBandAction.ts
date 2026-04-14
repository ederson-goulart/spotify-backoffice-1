"use server";

import { BandSchema } from "@/app/schemas/band.schema";
import path from "node:path";
import crypto from "node:crypto";
import { treeifyError, z } from "zod/v4";
import prisma from "../../../../../lib/prisma";
import minio from "../../../../../lib/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const MINIO_BUCKET = process.env.MINIO_BUCKET || "uploads";

type BandFormValues = z.infer<typeof BandSchema>;

export type CreateBandFormState = {
  status: "idle" | "loading" | "success" | "error";
  ok: boolean;
  message?: string;
  errors?: Record<string, { errors: string[] } | undefined>;
  values?: BandFormValues;
};

export async function createBandAction(
  _prevState: CreateBandFormState,
  formData: FormData,
): Promise<CreateBandFormState> {
  const cover = formData.getAll("cover") as File[];

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") || "") as string,
    cover,
  };

  //parse = lança uma exceção
  //safeParte = retorna um objeto com os detalhes do erro
  const validatedData = BandSchema.safeParse(data);

  if (!validatedData.success) {
    const treeErrors = treeifyError(validatedData.error);
    return {
      status: "error",
      ok: false,
      message: "Verifique os campos.",
      errors: treeErrors.properties,
      values: { ...data, status: "active" },
    };
  }

  // TODO: Verificar se o registro já existe!
  const bandExists = await prisma.band.findFirst({
    where: {
      name: validatedData.data.name,
    },
  });

  if (bandExists) {
    return {
      status: "error",
      ok: false,
      message: "Banda já cadastrada!",
      values: { ...data, status: "active" },
    };
  }

  const arrayBuffer = await data.cover[0].arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // define um nome único para o arquivo:
  const uniqueName = crypto.randomUUID();
  const extension = path.extname(data.cover[0].name);
  const objectKey = `${uniqueName}${extension}`;

  await minio.send(
    new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: objectKey,
      Body: buffer,
      ContentType: data.cover[0].type || "application/octet-stream",
      ACL: "public-read",
    }),
  );

  await prisma.band.create({
    data: {
      name: validatedData.data.name,
      slug: validatedData.data.slug,
      description: validatedData.data.description,
      status: validatedData.data.status,
      coverUrl: objectKey,
    },
  });

  return { status: "success", ok: true, message: `Banda criada com sucesso!` };
}
