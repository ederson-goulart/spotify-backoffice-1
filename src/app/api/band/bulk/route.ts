import z from "zod/v4";
import { BandArraySchema } from "@/app/schemas/band.schema";

// JSON (abordagem)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (Array.isArray(data)) {
      const validatedData = BandArraySchema.parse(data);
      // TODO: Armazenar os dados no banco de dados
      return new Response(
        JSON.stringify({ msg: "JSON (array)", validatedData }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Dados encaminhados em um formato inválido" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      console.error(
        "Erro de sintaxe ao ler o JSON do Body da requisição",
        error.message,
      );
      return new Response(
        JSON.stringify({
          error: "Conteúdo (body) da requisição está inválido!",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Erro de validação", details: error.issues }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }

    console.log("Erro desconhecido: ", error);
    return new Response(
      JSON.stringify({ error: "Erro desconhecido (erro interno do servidor)" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
        },
      },
    );
  }
}
