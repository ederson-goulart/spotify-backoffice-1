import prisma from "../../../../lib/prisma";

export async function GET() {
  const bands = await prisma.band.findMany();
  return Response.json(bands);
}

export function POST() {
  return Response.json({ msg: "API Rest - Método POST" });
}

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
