import z from "zod/v4";
import { BandArraySchema } from "@/app/schemas/band.schema";

// JSON (abordagem)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (Array.isArray(data)) {
      const validatedData = BandArraySchema.parse(data);
      // TODO: Armazenar os dados no banco de dados
      return Response.json({ msg: "JSON (array)", validatedData });
    } else {
      return Response.json(
        { error: "Dados encaminhados em um formato inválido" },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      console.error(
        "Erro de sintaxe ao ler o JSON do Body da requisição",
        error.message,
      );
      return Response.json(
        { error: "Conteúdo (body) da requisição está inválido!" },
        { status: 400 },
      );
    }

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Erro de validação", details: error.issues },
        { status: 400 },
      );
    }

    console.log("Erro desconhecido: ", error);
    return Response.json(
      { error: "Erro desconhecido (erro interno do servidor)" },
      { status: 500 },
    );
  }
}
