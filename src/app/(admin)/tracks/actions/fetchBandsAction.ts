"use server";

import prisma from "../../../../../lib/prisma";

export async function fetchBandsForSelectAction() {
  const bands = await prisma.band.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return bands;
}
