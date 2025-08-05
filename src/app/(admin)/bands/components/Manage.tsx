"use client";

import Button from "@/app/components/Button";
import List from "./List";
import Create from "./Create";
import { useEffect, useState } from "react";
import { BandList } from "../types/common";

export default function Manage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [data, setData] = useState<BandList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchBands = async (page: number = 1) => {
    try {
      setData(null);
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/band?page=${page}&take=10`,
      );
      const bandList: BandList = await response.json();
      setData(bandList);
      setLoading(false);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBands(currentPage);
  }, [currentPage]);

  return (
    <section className="overflow-x-auto p-4">
      <header className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>Adicionar</Button>
      </header>
      <List
        data={data}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      ></List>
      {isOpen && (
        <Create
          setIsOpen={setIsOpen}
          onSuccess={() => fetchBands()}
          setCurrentPage={setCurrentPage}
        ></Create>
      )}
    </section>
  );
}
