"use server";

import prisma from "../../../../../lib/prisma";

export async function fetchBandsAction(page: number = 1, take: number = 10) {
  console.log("Executado no contexto do servidor");

  const skip: number = (page - 1) * take;
  const totalItems = await prisma.band.count();
  const bands = await prisma.band.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(totalItems / take);
  return {
    pagination: { currentPage: page, totalItems, totalPages },
    bands,
  };
}
