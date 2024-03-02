"use client";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";
// ...

export default function SideNav() {
  const links = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Home", href: "/x", icon: HomeIcon },
    { name: "Home", href: "/f", icon: HomeIcon },
  ];

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
