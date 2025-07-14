"use client";

import Button from "@/app/components/Button";
import { Band } from "../../../../../generated/prisma";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";

const TableRow = ({ band }: { band: Band }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{band.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
        {band.description && band.description.length > 30
          ? `${band.description.slice(0, 30)}...`
          : band.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800">
          {band.status}
        </span>
      </td>
      <td className="text-right font-sm space-x-4 whitespace-nowrap">
        <Button>Editar</Button>
        <Button>Excluir</Button>
      </td>
    </tr>
  );
};

export default function List() {
  console.log("Sou um componente SSR ou CSR?");
  const [bands, setBands] = useState<Band[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        await new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 3000);
        });

        const response = await fetch("http://localhost:3001/api/band");
        const bands: Band[] = await response.json();
        setBands(bands);
        setLoading(false);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    fetchBands();
  }, []);

  return (
    <table className="min-w-full border border-gray-200 rounded-sm overflow-hidden">
      <thead className="bg-gray-800 text-gray-50 uppercase text-left text-sm">
        <tr>
          <th scope="col" className="px-6 py-3">
            Nome
          </th>
          <th scope="col" className="px-6 py-3">
            Descrição
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.isArray(bands) && bands.length > 0 ? (
          bands.map((band) => <TableRow key={band.id} band={band} />)
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-gray-500 py-4">
              {loading ? <Loading /> : "Nenhum registro encontrado"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
