"use client";
import Link from "next/link";
import {
  ArrowUpTrayIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { signOut } from "next-auth/react";
import { setUserInfo } from "@/lib/redux/features/userInfoSlice";

// ...
export default function TopBar() {
  const links = [];
  const user = useAppSelector((state) => state.userInfo);
  const router = useRouter();
  const appDispatch = useAppDispatch();

  if (!user?.access_token) {
    links.push(
      {
        cy: "login-link",
        name: "登入",
        href: "/login",
        icon: ArrowLeftStartOnRectangleIcon,
      },
      {
        cy: "register",
        name: "註冊",
        href: "/register",
        icon: UserPlusIcon,
      }
    );
  } else {
    links.push({
      cy: "video-upload-link",
      name: "上傳影片",
      href: "/video/upload",
      icon: ArrowUpTrayIcon,
    });
    links.push({
      cy: "user-info-link",
      name: "使用者資料",
      href: `/user/${user.account}`,
      icon: UserIcon,
    });
  }
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            data-cy={link.cy}
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
      {user?.access_token && (
        <form
          action={async () => {
            const response = await signOut({
              redirect: false,
              callbackUrl: "/",
            });
            appDispatch(setUserInfo({}));
            router.push(response.url);
          }}
        >
          <button
            data-cy="logout-link"
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
    </>
  );
}
