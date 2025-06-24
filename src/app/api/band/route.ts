//import path from "path";
import prisma from "../../../../lib/prisma";
//import { mkdir, writeFile } from "fs/promises";
import * as z from "zod/v4";

const BandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

const BandArraySchema = z.array(BandSchema).min(1);

export async function GET() {
  const bands = await prisma.band.findMany();
  return Response.json(bands);
}

// FormData (abordagem)
// export async function POST(request: Request) {
//   const formData = await request.formData();

//   const file = formData.get("cover");

//   if (!(file instanceof File)) {
//     return Response.json(
//       { error: "Arquivo não enviado ou inválido" },
//       { status: 400 },
//     );
//   }

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const uploadDir = path.join(process.cwd(), "public", "uploads");
//   await mkdir(uploadDir, { recursive: true });

//   const filePath = path.join(uploadDir, file.name);
//   await writeFile(filePath, buffer);

//   return Response.json({
//     msg: "Dados recebidos com sucesso!",
//     filePath: `/uploads/${file.name}`,
//   });
// }

// JSON (abordagem)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (Array.isArray(data)) {
      // tratar como array
      const validatedData = BandArraySchema.parse(data);
      // TODO: Armazenar os dados no banco de dados
      return Response.json({ msg: "JSON (array)", validatedData });
    } else if (typeof data === "object" && data !== null) {
      // tratar como item único
      const validatedData = BandSchema.parse(data);
      // TODO: Armazenar os dados no banco de dados
      return Response.json({ msg: "JSON (único)", validatedData });
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
