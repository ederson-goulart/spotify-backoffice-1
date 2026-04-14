import path from "node:path";
import crypto from "node:crypto";
import prisma from "../../../../lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import * as z from "zod/v4";
import { BandPatchSchema, BandSchema } from "@/app/schemas/band.schema";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "../../../../generated/prisma/runtime/library";
import { CustomError } from "@/app/utils/CustomError";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  console.log(searchParams);

  // skip (offset), take (limit)

  const currentPage: number = parseInt(searchParams.get("page") || "1"); // página atual
  const take: number = parseInt(searchParams.get("take") || "10");
  const skip: number = (currentPage - 1) * take;

  const totalItems = await prisma.band.count();

  const bands = await prisma.band.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(totalItems / take);
  return new Response(
    JSON.stringify({
      pagination: { currentPage, totalItems, totalPages },
      bands,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
      },
    },
  );
}

// FormData (abordagem)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const cover = formData.getAll("cover") as File[];

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || "",
      status: formData.get("status"),
      cover,
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

    // Track CREATE event
    await prisma.analyticsEvent.create({
      data: {
        type: "CREATE_BAND",
        page: "/admin/bands",
        action: "create",
        metadata: { bandId: insertedItem.id, bandName: insertedItem.name },
      },
    });

    return new Response(
      JSON.stringify({
        msg: "FormData",
        insertedItem,
        filePath: `/uploads/${data.cover[0].name}`,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Erro capturado: ", error);

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

    if (error instanceof PrismaClientInitializationError) {
      return new Response(
        JSON.stringify({ error: "Erro de conexão com o banco de dados" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
        },
      });
    }

    if (error instanceof CustomError) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: error.statusCode,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error:
            "Erro interno do servidor. Solicite para equipe responsável a avaliação dos logs de erros.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }

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

// JSON (abordagem)
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("Recebemos os dados do Form: ", data);
//     if (typeof data === "object" && data !== null) {
//       // const validatedData = BandSchema.parse(data);
//       // TODO: Armazenar os dados no banco de dados
//       //return Response.json({ msg: "JSON (único)", validatedData });
//       return Response.json({ msg: "JSON (único)", data });
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
//     // const validatedData = BandSchema.parse({
//     //   name: name,
//     //   slug: slug,
//     //   description: description || "",
//     //   status: status,
//     // });

//     // TODO: Armazenar os dados no banco de dados

//     // return Response.json({
//     //   msg: "URL Encoded",
//     //   validatedData,
//     // });

//     return Response.json({
//       msg: "URL Encoded",
//       data: { name, slug, description, status },
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

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    // Validação pelo Zod
    const data: Record<string, unknown> = {
      id: formData.get("id"),
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      status: formData.get("status"),
    };

    const coverFiles = formData.getAll("cover") as File[];
    if (coverFiles.length > 0) {
      data.cover = coverFiles;
    }

    const validatedData = BandPatchSchema.parse(data);

    // salvar o arquivo
    let fileName: string | undefined;

    if (data.cover && (data.cover as File[]).length > 0) {
      const file = (data.cover as File[])[0];

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), "public", "uploads");

      const uniqueName = crypto.randomUUID();
      const extension = path.extname(file.name);
      fileName = `${uniqueName}${extension}`;

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      //TODO - remover a imagem
    }

    console.log("fileName: ", fileName);

    // Update
    const updatedItem = await prisma.band.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        status: validatedData.status,
        ...(fileName && { coverUrl: fileName }),
      },
    });

    // Track UPDATE event
    await prisma.analyticsEvent.create({
      data: {
        type: "UPDATE_BAND",
        page: "/admin/bands",
        action: "update",
        metadata: { bandId: updatedItem.id, bandName: updatedItem.name },
      },
    });

    return new Response(
      JSON.stringify({ msg: "Registro Atualizado", data: updatedItem }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Erro capturado: ", error);

    if (error instanceof PrismaClientKnownRequestError) {
      return new Response(
        JSON.stringify({ error: "Registro não encontrado" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    }
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

export async function DELETE(request: Request) {
  try {
    const data = await request.json();

    const id = data.id;

    if (id) {
      // prisma
      const deletedItem = await prisma.band.delete({
        where: { id },
      });

      // Track DELETE event
      await prisma.analyticsEvent.create({
        data: {
          type: "DELETE_BAND",
          page: "/admin/bands",
          action: "delete",
          metadata: { bandId: deletedItem.id, bandName: deletedItem.name },
        },
      });

      //TODO - remover a imagem

      return new Response(
        JSON.stringify({ msg: "Registro removido", data: deletedItem }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    } else {
      throw new CustomError("ID não informado", 400); //400 bad request
    }
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
        },
      });
    }

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

export function HEAD() {
  return Response.json({ msg: "API Rest - Método HEAD" });
}

export function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
