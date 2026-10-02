"use client";

import { usePathname } from "next/navigation";
import type { SessionUser } from "@/app/layout";
import Navbar from "./navbar/navbar";

export default function AppShell({ children, user }: {
  children: React.ReactNode;
  user: SessionUser | null;
}) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen min-w-0 pt-16 md:pl-64">
        {children}
      </div>
    </>
  );
}
