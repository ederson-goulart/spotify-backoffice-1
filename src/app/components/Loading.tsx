import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="loading.svg"
        width={40}
        height={40}
        alt="Carregando..."
      ></Image>
      Carregando...
    </div>
  );
}
