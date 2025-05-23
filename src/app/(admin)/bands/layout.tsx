import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="border-4 border-green-700">
      <h1>Teste Bands</h1>
      {children}
    </div>
  );
}
