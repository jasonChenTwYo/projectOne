"use client";
import Link from "next/link";
import {
  ArrowUpTrayIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

// ...
export default function TopBar({ session }: { session: Session | null }) {
  const links = [];
  if (!session?.access_token) {
    links.push(
      {
        name: "登入",
        href: "/login",
        icon: ArrowLeftStartOnRectangleIcon,
      },
      {
        name: "註冊",
        href: "/register",
        icon: UserPlusIcon,
      }
    );
  } else {
    links.push({
      name: "上傳影片",
      href: "/video/upload",
      icon: ArrowUpTrayIcon,
    });
  }
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              "hover:bg-sky-500/50 hover:text-blue-600",
              {
                "bbg-sky-500/50 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block text-base">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
