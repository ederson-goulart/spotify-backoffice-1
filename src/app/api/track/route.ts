import prisma from "../../../../lib/prisma";
import * as z from "zod/v4";
import { TrackPatchSchema, TrackSchema } from "@/app/schemas/track.schema";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "../../../../generated/prisma/runtime/library";
import { CustomError } from "@/app/utils/CustomError";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const currentPage: number = parseInt(searchParams.get("page") || "1");
  const take: number = parseInt(searchParams.get("take") || "10");
  const skip: number = (currentPage - 1) * take;

  const totalItems = await prisma.track.count();

  const tracks = await prisma.track.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      band: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalItems / take);
  return new Response(
    JSON.stringify({
      pagination: { currentPage, totalItems, totalPages },
      tracks,
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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const validatedData = TrackSchema.parse(data);

    const trackExists = await prisma.track.findFirst({
      where: {
        slug: validatedData.slug,
      },
    });

    if (trackExists) {
      throw new CustomError("Música com este slug já cadastrada", 409);
    }

    const bandExists = await prisma.band.findFirst({
      where: {
        id: validatedData.bandId,
      },
    });

    if (!bandExists) {
      throw new CustomError("Banda selecionada não existe", 404);
    }

    const insertedItem = await prisma.track.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        durationInSeconds: validatedData.durationInSeconds,
        bandId: validatedData.bandId,
      },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });

    // Track CREATE event
    await prisma.analyticsEvent.create({
      data: {
        type: "CREATE_TRACK",
        page: "/admin/tracks",
        action: "create",
        metadata: { trackId: insertedItem.id, trackTitle: insertedItem.title },
      },
    });

    return new Response(
      JSON.stringify({
        msg: "Música criada com sucesso",
        insertedItem,
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

export function PUT() {
  return new Response(JSON.stringify({ msg: "API Rest - Método PUT" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
    },
  });
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();

    const validatedData = TrackPatchSchema.parse(data);

    const updatedItem = await prisma.track.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        durationInSeconds: validatedData.durationInSeconds,
        bandId: validatedData.bandId,
      },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });

    // Track UPDATE event
    await prisma.analyticsEvent.create({
      data: {
        type: "UPDATE_TRACK",
        page: "/admin/tracks",
        action: "update",
        metadata: { trackId: updatedItem.id, trackTitle: updatedItem.title },
      },
    });

    return new Response(
      JSON.stringify({
        msg: "Música atualizada com sucesso",
        data: updatedItem,
      }),
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

    if (error instanceof PrismaClientKnownRequestError) {
      return new Response(JSON.stringify({ error: "Música não encontrada" }), {
        status: 404,
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

export async function DELETE(request: Request) {
  try {
    const data = await request.json();

    const id = data.id;

    if (id) {
      const deletedItem = await prisma.track.delete({
        where: { id },
      });

      // Track DELETE event
      await prisma.analyticsEvent.create({
        data: {
          type: "DELETE_TRACK",
          page: "/admin/tracks",
          action: "delete",
          metadata: { trackId: deletedItem.id, trackTitle: deletedItem.title },
        },
      });

      return new Response(
        JSON.stringify({
          msg: "Música removida com sucesso",
          data: deletedItem,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
          },
        },
      );
    } else {
      throw new CustomError("ID não informado", 400);
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
  return new Response(JSON.stringify({ msg: "API Rest - Método HEAD" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://spot.eletrica.cloud",
    },
  });
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
