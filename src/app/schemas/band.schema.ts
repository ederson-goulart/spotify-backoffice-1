import z from "zod/v4";

export const BandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export const BandArraySchema = z.array(BandSchema).min(1);
