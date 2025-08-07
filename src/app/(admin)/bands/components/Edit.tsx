import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import { BandPatchSchema } from "@/app/schemas/band.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import toast from "react-hot-toast";
import { Band } from "../../../../../generated/prisma";
import Image from "next/image";

interface Props {
  band: Band;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

type BandFormData = z.infer<typeof BandPatchSchema>;

export default function Edit({
  band,
  setIsOpen,
  onSuccess,
  setCurrentPage,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState, reset } = useForm<BandFormData>({
    resolver: zodResolver(BandPatchSchema),
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (band: BandFormData) => {
    try {
      setIsLoading(true);

      const bandFormData = new FormData();

      bandFormData.append("name", band.name);
      bandFormData.append("slug", band.slug);
      bandFormData.append("description", band.description || "");
      bandFormData.append("status", band.status);

      /*
      Array.from(band.cover).forEach((cover) => {
        bandFormData.append("cover", cover);
      });
      */
      const response = await fetch("http://localhost:3001/api/band", {
        method: "PATCH",
        body: bandFormData,
      });

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso");
        onSuccess();
        setCurrentPage(1);
        setIsOpen(false);
      } else if (response.status === 409) {
        toast.error("Banda já cadastrada anteriormente!");
      } else {
        throw new Error("Erro ao cadastrar a banda");
      }
    } catch (e: unknown) {
      console.error("Error: ", e);

      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Erro ao cadastrar a banda");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (band) {
      reset({
        name: band.name,
        slug: band.slug,
        description: band.description || "",
        status: band.status,
      });
    }
  }, [band, reset]);

  return (
    <>
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
            Atualizar Banda
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
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
              <span className="font-semibold text-sm">Status:</span>
              <select
                {...register("status")}
                className="w-full p-2 border rounded"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
              {formState?.errors?.status && (
                <p className="text-red-500 text-sm">
                  {formState.errors.status.message}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-sm">Capa atual:</span>
              <div className="space-y-2">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={`/uploads/${band.coverUrl}`}
                    alt="Capa atual"
                    width={420}
                    height={420}
                    className="w-full h-full object-cover"
                  />
                </div>
                {formState?.errors?.cover && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.cover.message}
                  </p>
                )}
              </div>
            </div>

            {/* 
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
            */}

            <div className="flex justify-end">
              <Button
                disabled={isLoading}
                className="flex w-[120px] justify-center"
              >
                {isLoading ? (
                  <Loading width={20} height={20} showText={false} />
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
