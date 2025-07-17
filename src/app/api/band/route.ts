import path from "node:path";
import crypto from "node:crypto";
import prisma from "../../../../lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import * as z from "zod/v4";
import { BandSchema } from "@/app/schemas/band.schema";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "../../../../generated/prisma/runtime/library";
import { CustomError } from "@/app/utils/CustomError";

export async function GET() {
  // skip (offset), take (limit)

  const currentPage: number = 7; // página atual
  const take: number = 5;
  const skip: number = (currentPage - 1) * take;

  const totalItems = await prisma.band.count();

  const bands = await prisma.band.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(totalItems / take);
  return Response.json({
    pagination: { currentPage, totalItems, totalPages },
    bands,
  });
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

    // TODO: Verificar se o registro já existe!
    const bandExists = await prisma.band.findFirst({
      where: {
        name: validatedData.name,
      },
    });

    // truthy, falsy
    if (bandExists) {
      throw new CustomError("Banda já cadastrada", 409);
    }

    if (!(data.cover instanceof File)) {
      throw new CustomError("Tipo inválido de arquivo", 400);
    }

    const arrayBuffer = await data.cover.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // define um nome único para o arquivo:
    const uniqueName = crypto.randomUUID();
    const extension = path.extname(data.cover.name);
    const fileName = `${uniqueName}${extension}`;

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Inserir os dados no banco de dados
    const insertedItem = await prisma.band.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        status: validatedData.status,
        coverUrl: fileName,
      },
    });

    return Response.json({
      msg: "FormData",
      insertedItem,
      filePath: `/uploads/${data.cover.name}`,
    });
  } catch (error: unknown) {
    console.error("Erro capturado: ", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Erro de validação", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof PrismaClientInitializationError) {
      return Response.json(
        { error: "Erro de conexão com o banco de dados" },
        { status: 500 },
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof CustomError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: error.statusCode },
      );
    }

    if (error instanceof Error) {
      return Response.json(
        {
          error:
            "Erro interno do servidor. Solicite para equipe responsável a avaliação dos logs de erros.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      { error: "Erro desconhecido (erro interno do servidor)" },
      { status: 500 },
    );
  }
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
