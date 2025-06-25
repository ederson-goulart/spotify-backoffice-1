import path from "node:path";
import prisma from "../../../../lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import * as z from "zod/v4";
import { BandSchema } from "@/app/schemas/band.schema";

export async function GET() {
  const bands = await prisma.band.findMany();
  return Response.json(bands);
}

// FormData (abordagem)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log(formData);

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || "",
      status: formData.get("status"),
      cover: formData.get("cover"),
    };

    const validatedData = BandSchema.parse(data);

    if (!(data.cover instanceof File)) {
      throw new Error("Tipo inválido de arquivo");
    }

    const arrayBuffer = await data.cover.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, data.cover.name);
    await writeFile(filePath, buffer);

    return Response.json({
      msg: "FormData",
      validatedData,
      filePath: `/uploads/${data.cover.name}`,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Erro de validação", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.log("Erro desconhecido: ", error);
    return Response.json(
      { error: "Erro desconhecido (erro interno do servidor)" },
      { status: 500 },
    );
  }

  /*
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  
  */
}

// JSON (abordagem)
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     if (typeof data === "object" && data !== null) {
//       const validatedData = BandSchema.parse(data);
//       // TODO: Armazenar os dados no banco de dados
//       return Response.json({ msg: "JSON (único)", validatedData });
//     } else {
//       return Response.json(
//         { error: "Dados encaminhados em um formato inválido" },
//         { status: 400 },
//       );
//     }
//   } catch (error: unknown) {
//     if (error instanceof SyntaxError) {
//       console.error(
//         "Erro de sintaxe ao ler o JSON do Body da requisição",
//         error.message,
//       );
//       return Response.json(
//         { error: "Conteúdo (body) da requisição está inválido!" },
//         { status: 400 },
//       );
//     }

//     if (error instanceof z.ZodError) {
//       return Response.json(
//         { error: "Erro de validação", details: error.issues },
//         { status: 400 },
//       );
//     }

//     console.log("Erro desconhecido: ", error);
//     return Response.json(
//       { error: "Erro desconhecido (erro interno do servidor)" },
//       { status: 500 },
//     );
//   }
// }

// URL Enconded (abordagem)
// export async function POST(request: Request) {
//   try {
//     const bodyText = await request.text();
//     const params = new URLSearchParams(bodyText);
//     const name = params.get("name");
//     const slug = params.get("slug");
//     const description = params.get("description");
//     const status = params.get("status");

//     // Validação dos dados
//     const validatedData = BandSchema.parse({
//       name: name,
//       slug: slug,
//       description: description || "",
//       status: status,
//     });

//     // TODO: Armazenar os dados no banco de dados

//     return Response.json({
//       msg: "URL Encoded",
//       validatedData,
//     });
//   } catch (error: unknown) {
//     if (error instanceof z.ZodError) {
//       return Response.json(
//         { error: "Erro de validação", details: error.issues },
//         { status: 400 },
//       );
//     }

//     console.log("Erro desconhecido: ", error);
//     return Response.json(
//       { error: "Erro desconhecido (erro interno do servidor)" },
//       { status: 500 },
//     );
//   }
// }

export function PUT() {
  return Response.json({ msg: "API Rest - Método PUT" });
}

export function PATCH() {
  return Response.json({ msg: "API Rest - Método PATCH" });
}

export function DELETE() {
  return Response.json({ msg: "API Rest - Método DELETE" });
}

export function HEAD() {
  return Response.json({ msg: "API Rest - Método HEAD" });
}

export function OPTIONS() {
  return Response.json({ msg: "API Rest - Método OPTIONS" });
}
