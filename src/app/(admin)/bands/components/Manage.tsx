"use client";

import Button from "@/app/components/Button";
import List from "./List";
import Create from "./Create";
import { useState } from "react";

export default function Manage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section className="overflow-x-auto p-4">
      <header className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>Adicionar</Button>
      </header>
      <List></List>
      {isOpen && <Create setIsOpen={setIsOpen}></Create>}
    </section>
  );
}
