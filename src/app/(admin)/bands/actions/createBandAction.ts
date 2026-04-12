"use server";

import { BandSchema } from "@/app/schemas/band.schema";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { treeifyError, z } from "zod/v4";
import prisma from "../../../../../lib/prisma";

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

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // define um nome único para o arquivo:
  const uniqueName = crypto.randomUUID();
  const extension = path.extname(data.cover[0].name);
  const fileName = `${uniqueName}${extension}`;

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  await prisma.band.create({
    data: {
      name: validatedData.data.name,
      slug: validatedData.data.slug,
      description: validatedData.data.description,
      status: validatedData.data.status,
      coverUrl: fileName,
    },
  });

  return { status: "success", ok: true, message: `Banda criada com sucesso!` };
}
