import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNav from "@/app/ui/common/sideNav";
import TopBar from "@/app/ui/common/topBar";
import clsx from "clsx";
import { auth } from "@/lib/config/auth.config";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Platform!",
  description: "Video Platform!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={clsx(inter.className, "flex flex-col h-screen")}>
        <StoreProvider session={session}>
          <div className="flex justify-end items-center px-4 h-12 bg-blue-400 w-full fixed">
            <TopBar />
          </div>
          <div className="flex flex-row h-full pt-12">
            <div className="h-full w-full flex-none md:w-64 bg-neutral-400 fixed">
              <SideNav />
            </div>
            <div className="grow md:ml-64 md:pl-5 overflow-auto">
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
