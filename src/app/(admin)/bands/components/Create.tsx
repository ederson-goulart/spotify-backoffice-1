import Button from "@/app/components/Button";
import { BandSchema } from "@/app/schemas/band.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

type BandFormData = z.infer<typeof BandSchema>;

export default function Create({ setIsOpen }: Props) {
  // handleSubmit -> processa o envio do formulário
  // formState -> estado do formulário
  // register -> conecta os inputs do formulário ao React Hook Form
  const { register, handleSubmit, formState } = useForm<BandFormData>({
    resolver: zodResolver(BandSchema),
    // resolver -> integra biblioteca de validação externa (zod, yup, joi, etc)
    defaultValues: {
      status: "active",
    },
  });

  console.log(formState.errors);

  const onSubmit = async (band: BandFormData) => {
    try {
      const bandJSON = JSON.stringify(band);

      const bandURLEncoded = new URLSearchParams({
        name: band.name,
        slug: band.slug,
        description: band.description || "",
        status: band.status,
      });

      // console.log("Objeto: ", band);
      // console.log("JSON: ", bandJSON);
      // console.log("URL Encoded: ", bandURLEncoded.toString());

      const response = await fetch("http://localhost:3001/api/band", {
        method: "POST",
        body: bandURLEncoded.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = await response.json();
      console.log("Resposta: ", data);
    } catch (e: unknown) {
      console.error("Error: ", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-8 text-gray-500 hover:text-gray-800 text-4xl font-bold hover:cursor-pointer"
          arial-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cadastrar Banda
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <span className="font-semibold text-sm">Nome:</span>
            <input
              {...register("name")}
              type="text"
              placeholder="Legião Urbana"
              className="w-full p-2 border rounded"
            ></input>
            {formState?.errors?.name && (
              <p className="text-red-500 text-sm">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Slug:</span>
            <input
              {...register("slug")}
              type="text"
              placeholder="legiao-urbana"
              className="w-full p-2 border rounded"
            ></input>
            {formState?.errors?.slug && (
              <p className="text-red-500 text-sm">
                {formState.errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Descrição:</span>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded block"
            ></textarea>
            {formState?.errors?.description && (
              <p className="text-red-500 text-sm">
                {formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <span className="font-semibold text-sm">Capa:</span>
            <input
              {...register("cover")}
              type="file"
              accept=".png, .jpg, .jpeg"
              className="w-full border rounded file:p-2 file:bg-gray-200"
            ></input>
            {formState?.errors?.cover && (
              <p className="text-red-500 text-sm">
                {formState.errors.cover.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button>Adicionar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
