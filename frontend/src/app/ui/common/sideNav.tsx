"use client";
import Link from "next/link";
import {
  HomeIcon,
  TagIcon,
  ArrowUpTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { useAppSelector } from "@/lib/redux/hook";

// ...

export default function SideNav() {
  const links = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "分類1", href: "/video/play", icon: TagIcon },
    { name: "分類2", href: "/video/test1", icon: TagIcon },
  ];

  const user = useAppSelector((state) => state.userInfo);

  if (user?.access_token) {
    links.push({
      name: "觀看紀錄",
      href: "/video/upload",
      icon: ClockIcon,
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
              " hover:bg-stone-500 hover:text-orange-600",
              {
                "bg-stone-500 text-orange-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
