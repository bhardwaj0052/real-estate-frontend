"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/login";

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <Header />
      <Sidebar />
      {children}
    </>
  );
}