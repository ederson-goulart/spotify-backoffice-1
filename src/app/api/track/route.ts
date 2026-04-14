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
  return Response.json({
    pagination: { currentPage, totalItems, totalPages },
    tracks,
  });
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

    return Response.json(
      {
        msg: "Música criada com sucesso",
        insertedItem,
      },
      { status: 201 },
    );
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

export function PUT() {
  return Response.json({ msg: "API Rest - Método PUT" });
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

    return Response.json(
      { msg: "Música atualizada com sucesso", data: updatedItem },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Erro capturado: ", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Erro de validação", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return Response.json({ error: "Música não encontrada" }, { status: 404 });
    }

    return Response.json(
      { error: "Erro desconhecido (erro interno do servidor)" },
      { status: 500 },
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

      return Response.json(
        { msg: "Música removida com sucesso", data: deletedItem },
        { status: 200 },
      );
    } else {
      throw new CustomError("ID não informado", 400);
    }
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof CustomError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      { error: "Erro desconhecido (erro interno do servidor)" },
      { status: 500 },
    );
  }
}

export function HEAD() {
  return Response.json({ msg: "API Rest - Método HEAD" });
}

export function OPTIONS() {
  return Response.json({ msg: "API Rest - Método OPTIONS" });
}
