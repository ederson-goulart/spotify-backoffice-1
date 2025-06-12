import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.band.create({
    data: {
      name: "Roupa Nova",
      slug: "roupa-nova",
      status: "active",
      tracks: {
        create: [
          { title: "Dona", slug: "dona", durationInSeconds: 244 },
          {
            title: "Linda Demais",
            slug: "linda-demais",
            durationInSeconds: 281,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
