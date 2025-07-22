import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

export default function Button({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-gray-50 bg-gray-800 hover:bg-gray-950 cursor-pointer"
    >
      {children}
    </button>
  );
}
