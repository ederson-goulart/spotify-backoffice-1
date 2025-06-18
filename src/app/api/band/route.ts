import prisma from "../../../../lib/prisma";

export async function GET() {
  const bands = await prisma.band.findMany();
  return Response.json(bands);
}

export async function POST(request: Request) {
  const bodyText = await request.text();
  const params = new URLSearchParams(bodyText);
  const name = params.get("name");
  const slug = params.get("slug");
  const description = params.get("description");
  const status = params.get("status");

  // TODO: Armazenar os dados no banco de dados

  return Response.json({
    msg: "Dados recebidos com sucesso!",
    data: { name, slug, description, status },
  });
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
