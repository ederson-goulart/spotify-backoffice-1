"use client";

import Button from "@/app/components/Button";
import { Band } from "../../../../../generated/prisma";
import Loading from "@/app/components/Loading";
import Pagination from "./Pagination";
import { BandList } from "../types/common";

interface Props {
  data: BandList | null;
  loading: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

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

export default function List({
  data,
  loading,
  currentPage,
  setCurrentPage,
}: Props) {
  return (
    <>
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
          {Array.isArray(data?.bands) && data.bands.length > 0 ? (
            data.bands.map((band) => <TableRow key={band.id} band={band} />)
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
                {loading ? <Loading /> : "Nenhum registro encontrado"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data?.pagination.totalPages && (
        <Pagination
          totalPages={data?.pagination.totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}
