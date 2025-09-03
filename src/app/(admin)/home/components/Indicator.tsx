import prisma from "../../../../../lib/prisma";

interface Props {
  type: "bands" | "tracks";
}

enum TYPE {
  BANDS = "bands",
  TRACKS = "tracks",
}

export default async function Indicator({ type }: Props) {
  let value: number = 0;
  let title: string = "";

  if (type === TYPE.BANDS) {
    title = "Bandas";
    //value = await prisma.band.count();
    value = await new Promise<number>((resolve) => {
      setTimeout(async () => {
        const total = await prisma.band.count();
        resolve(total);
      }, 3000);
    });
  }

  if (type === TYPE.TRACKS) {
    title = "Trilhas";
    //value = await prisma.track.count();
    value = await new Promise<number>((resolve) => {
      setTimeout(async () => {
        const total = await prisma.track.count();
        resolve(total);
      }, 6000);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center border-[1px] border-gray-800 text-gray-800 bg-gray-100 rounded-sm py-4 px-12">
      <p className="uppercase">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
