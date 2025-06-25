import z from "zod/v4";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export const BandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  cover: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Arquivo é obrigatório" })
    .refine((file) => file.size < MAX_SIZE_MB * 1024 * 1024, {
      message: `O tamanho máximo permitido é de ${MAX_SIZE_MB}MB`,
    })
    .refine((file) => ACCEPTED_TYPES.includes(file.type), {
      message: `Tipo inválido. Permitidos: ${ACCEPTED_TYPES.join(", ")}`,
    }),
});

export const BandArraySchema = z.array(BandSchema).min(1);
