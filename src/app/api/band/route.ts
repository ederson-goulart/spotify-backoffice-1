import path from "path";
import prisma from "../../../../lib/prisma";
import { mkdir, writeFile } from "fs/promises";

export async function GET() {
  const bands = await prisma.band.findMany();
  return Response.json(bands);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("cover");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "Arquivo não enviado ou inválido" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  return Response.json({
    msg: "Dados recebidos com sucesso!",
    filePath: `/uploads/${file.name}`,
  });
}

// JSON (abordagem)
// export async function POST(request: Request) {
//   const data = await request.json();
//   console.log(data);

//   // TODO: Armazenar os dados no banco de dados

//   return Response.json({ msg: "Dados recebidos com sucesso!", data });
// }

// URL Enconded (abordagem)
// export async function POST(request: Request) {
//   const bodyText = await request.text();
//   const params = new URLSearchParams(bodyText);
//   const name = params.get("name");
//   const slug = params.get("slug");
//   const description = params.get("description");
//   const status = params.get("status");

//   // TODO: Armazenar os dados no banco de dados

//   return Response.json({
//     msg: "Dados recebidos com sucesso!",
//     data: { name, slug, description, status },
//   });
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
