"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type PropsSidebar = {
  open: boolean;
  onClose: () => void;
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
      name: "Category Universe",
      url: "/category-universe",
      logo: "M12 3v18m9-9H3m15.364-6.364-12.728 12.728m0-12.728 12.728 12.728",
    },
    {
      name: "Tier Templates",
      url: "/tier-template",
      logo: "M4 5h16M4 12h16M4 19h16",
    },
    // {
    //   name: "Song",
    //   url: "/song",
    //   logo: "M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.326-1.343 2.4-3 2.4s-3-1.075-3-2.4 1.343-2.4 3-2.4 3 1.075 3 2.4Z",
    // },
    {
      name: "Artist",
      url: "/artist",
      logo: "M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.326-1.343 2.4-3 2.4s-3-1.075-3-2.4 1.343-2.4 3-2.4 3 1.075 3 2.4Z",
    },
    {
      name: "Users",
      url: "/user",
      logo: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-3v6m3-3h-6",
    },
  ];


  const pathname = usePathname();
  useEffect(() => {
    if (!props.open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [props.open, props.onClose]);

  return (
    <>
      {props.open && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
          aria-label="Close sidebar"
          onClick={props.onClose}
        />
      )}
      <aside
        id="logo-sidebar"
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-gray-200 bg-white transition-transform md:translate-x-0 ${props.open ? "translate-x-0" : "-translate-x-full invisible md:visible"}`}
        aria-label="Sidebar"
      >
        <nav aria-label="Main navigation" className="h-full overflow-y-auto px-3 py-6">
          <ul className="space-y-2 font-medium">
            {menuSidebar.map((item) => {
              const active = item.url === "/" ? pathname === "/" : pathname === item.url || pathname.startsWith(`${item.url}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    onClick={props.onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${active ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50 hover:text-pink-600"}`}
                  >
                    <svg
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.logo}
                      />
                    </svg>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
