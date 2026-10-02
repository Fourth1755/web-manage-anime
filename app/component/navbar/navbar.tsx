"use client";
import { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "../mtailwind";
import type { SessionUser } from "@/app/layout";
import LogoutButton from "./logoutButton";

type NavbarProps = {
  user: SessionUser | null;
};

export default function Navbar({ user }: NavbarProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleClose = () => setSidebarOpen(false);
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/login" ? (
        <>
          <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-4 bg-pink-500 px-4 md:px-6">
            <Link href="/" className="flex shrink-0 items-center">
              <h1 className="my-auto font-castoro italic text-lg">Animap</h1>
            </Link>
            <div className="ml-auto flex min-w-0 items-center gap-3">
              {user ? (
                <>
                  <span className="hidden max-w-48 truncate text-white text-sm font-medium sm:block">{user.name || user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <Button variant="gradient" color="green">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
            <button
              aria-controls="logo-sidebar"
              aria-expanded={isSidebarOpen}
              type="button"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="inline-flex shrink-0 items-center rounded-lg p-2 text-sm text-white md:hidden hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 17 14"
              >
                <path d="M16 2H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 0 1 0 2Z" />
              </svg>
            </button>
          </nav>
          <Sidebar open={isSidebarOpen} onClose={handleClose} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
