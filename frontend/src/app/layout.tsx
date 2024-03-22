import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNav from "@/app/ui/common/sideNav";
import TopBar from "@/app/ui/common/topBar";
import clsx from "clsx";
import { auth, signOut } from "@/lib/config/auth.config";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/20/solid";
import { signOutApi } from "@/service/api";
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
  console.log("RootLayout");
  return (
    <html lang="en">
      <body className={clsx(inter.className, "flex flex-col h-screen")}>
        <StoreProvider session={session}>
          <div className="flex justify-end items-center px-4 h-12 bg-blue-400 w-full">
            <TopBar />
            {session?.access_token && (
              <form
                action={async () => {
                  "use server";
                  const response = await signOutApi();
                  console.log(response.message);
                  if (response.message === "logoutSuccess") {
                    await signOut({ redirectTo: "/" });
                  }
                }}
              >
                <button
                  className={clsx(
                    "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md font-medium md:flex-none md:justify-start md:p-2 md:px-3",
                    " hover:bg-sky-500/50 hover:text-blue-600"
                  )}
                >
                  <div className="hidden md:block text-base">登出</div>
                  <ArrowRightStartOnRectangleIcon className="w-6" />
                </button>
              </form>
            )}
          </div>
          <div className="flex flex-row h-full">
            <div className="w-full flex-none md:w-64 bg-neutral-400">
              <SideNav />
            </div>
            <div className="grow">{children}</div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
