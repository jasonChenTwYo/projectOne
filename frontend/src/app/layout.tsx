import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNav from "./ui/common/SideNav";
import TopBar from "./ui/common/TopBar";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Platform!",
  description: "Video Platform!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "flex flex-col h-screen")}>
        <div className="flex justify-end items-center px-4 h-12 bg-blue-400 w-full">
          <TopBar />
        </div>
        <div className="flex flex-row h-full">
          <div className="w-full flex-none md:w-64 bg-neutral-400">
            <SideNav />
          </div>
          <div className="grow">{children}</div>
        </div>
      </body>
    </html>
  );
}
