import Button from "@/app/components/Button";
import List from "./List";
import Create from "./Create";

export default function Manage() {
  return (
    <section className="overflow-x-auto p-4">
      <header className="flex justify-end mb-4">
        <Button>Adicionar</Button>
      </header>
      <List></List>
      <Create></Create>
    </section>
  );
}
