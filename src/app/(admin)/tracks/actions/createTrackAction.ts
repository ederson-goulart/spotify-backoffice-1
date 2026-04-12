"use server";

import { TrackSchema } from "@/app/schemas/track.schema";
import { treeifyError, z } from "zod/v4";
import prisma from "../../../../../lib/prisma";

type TrackFormValues = z.infer<typeof TrackSchema>;

export type CreateTrackFormState = {
  status: "idle" | "loading" | "success" | "error";
  ok: boolean;
  message?: string;
  errors?: Record<string, { errors: string[] } | undefined>;
  values?: TrackFormValues;
};

export async function createTrackAction(
  _prevState: CreateTrackFormState,
  formData: FormData,
): Promise<CreateTrackFormState> {
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    durationInSeconds: parseInt(formData.get("durationInSeconds") as string),
    bandId: formData.get("bandId") as string,
  };

  const validatedData = TrackSchema.safeParse(data);

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

  // Verificar se o slug já existe
  const trackExists = await prisma.track.findFirst({
    where: {
      slug: validatedData.data.slug,
    },
  });

  if (trackExists) {
    return {
      status: "error",
      ok: false,
      message: "Música com este slug já cadastrada!",
      values: { ...data, status: "active" },
    };
  }

  // Verificar se a banda existe
  const bandExists = await prisma.band.findFirst({
    where: {
      id: validatedData.data.bandId,
    },
  });

  if (!bandExists) {
    return {
      status: "error",
      ok: false,
      message: "Banda selecionada não existe!",
      values: { ...data, status: "active" },
    };
  }

  await prisma.track.create({
    data: {
      title: validatedData.data.title,
      slug: validatedData.data.slug,
      durationInSeconds: validatedData.data.durationInSeconds,
      bandId: validatedData.data.bandId,
    },
  });

  return { status: "success", ok: true, message: `Música criada com sucesso!` };
}
