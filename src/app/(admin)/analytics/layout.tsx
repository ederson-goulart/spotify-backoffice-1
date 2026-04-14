import { ReactNode } from "react";
import Header from "../components/Header";

interface Props {
  children: ReactNode;
}

export default function AnalyticsLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
