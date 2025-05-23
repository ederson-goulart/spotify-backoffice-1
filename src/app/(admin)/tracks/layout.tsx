import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="border-4 border-red-700">
      <h1>Teste</h1>
      {children}
    </div>
  );
}
