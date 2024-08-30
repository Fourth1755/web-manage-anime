"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type PropsSidebar = {
  open: boolean;
  onClose: any;
};

export default function Sidebar(props: PropsSidebar) {
  const menuSidebar = [
    {
      name: "Home",
      url: "/",
      logo: "m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5",
    },
    {
      name: "Anime",
      url: "/anime",
      logo: "m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z",
    },
    {
      name: "Category",
      url: "/category",
      logo: "M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z",
    },
    {
      name: "Song",
      url: "/song",
      logo: "M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.326-1.343 2.4-3 2.4s-3-1.075-3-2.4 1.343-2.4 3-2.4 3 1.075 3 2.4Z",
    },

  ];


  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const closeSideBar = () => {
    props.onClose();
    setOpen(false);
  };


  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full  md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuSidebar.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-pink-500 transition duration-75 group-hover:text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 2 24 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.logo}
                    />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-pink-500">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {isOpen ? (
        <aside
          id="logo-sidebar"
          className="md:hidden fixed top-0 right-0 z-40 w-64 h-screen pt-10 bg-pink-500"
          aria-label="Sidebar"
        >
          <button
            className="px-4 py-2 mx-2 items-center"
            onClick={closeSideBar}
          >
            <svg
              className="flex-shrink-0 w-7 h-7 transition duration-75 dark:text-gray-400 group-hover:text-gray-900"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
          <div className="pt-2 h-full px-3 pb-4 overflow-y-auto dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              {menuSidebar.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.logo}
                      />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : (
        <></>
      )}
    </>
  );
}