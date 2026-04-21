import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/provider";
import Navbar from "./component/navbar/navbar";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Animap",
  description: "Anime management system",
};

export type SessionUser = {
  uuid: string;
  email: string;
  name: string;
  role: string;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: SessionUser | null = null;
  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    const token = all.find(c => c.value.startsWith('eyJ'))?.value;
    if (token) {
      const payload = decodeJwt(token);
      user = {
        uuid: payload.uuid as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string,
      };
    }
  } catch {
    user = null;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar user={user} />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
