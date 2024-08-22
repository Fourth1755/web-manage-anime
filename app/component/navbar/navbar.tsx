"use client";
import { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleClose = () => setSidebarOpen(false);

  const pathname = usePathname()
  return (
    <>
      {pathname != "/login" ? (
        <>
          <nav className="bg-pink-500 w-full p-2 flex justify-between fixed">
            <div className="flex justify-center w-40">
              <h1 className="my-auto font-castoro italic text-lg">Animap</h1>
            </div>
            <div className="md:flex hidden justify-center w-40">
              <Link href={"/login"}>
                <button className="bg-success px-6 py-2 my-auto rounded-lg">
                  Sign In
                </button>
              </Link>
            </div>
            <button
              data-drawer-target="default-sidebar"
              data-drawer-toggle="default-sidebar"
              aria-controls="default-sidebar"
              type="button"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 text-white dark:text-white"
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