"use server";

import { BandSchema } from "@/app/schemas/band.schema";
import { treeifyError } from "zod/v4";

export type CreateBandFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, { errors: string[] } | undefined>;
};

export async function createBandAction(
  _prevState: CreateBandFormState,
  formData: FormData,
): Promise<CreateBandFormState> {
  const cover = formData.getAll("cover") as File[];

  const data = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    cover,
  };

  //parse = lança uma exceção
  //safeParte = retorna um objeto com os detalhes do erro
  const validatedData = BandSchema.safeParse(data);

  if (!validatedData.success) {
    const treeErrors = treeifyError(validatedData.error);
    return {
      ok: false,
      message: "Verifique os campos.",
      errors: treeErrors.properties,
    };
  }

  return { ok: true, message: "Banda criada com sucesso!" };
}
