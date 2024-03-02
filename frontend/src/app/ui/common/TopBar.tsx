import Link from "next/link";
import {
  ArrowUpTrayIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { auth, signOut } from "@/common/config/auth.config";
import { signOutApi } from "@/service/api";

// ...
export default async function TopBar() {
  const links = [];
  const session = await auth();
  if (!session?.access_token) {
    links.push({
      name: "Sign in",
      href: "/login",
      icon: ArrowLeftStartOnRectangleIcon,
    });
  } else {
    links.push({
      name: "Upload Video",
      href: "/video/upload",
      icon: ArrowUpTrayIcon,
    });
  }
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
              "hover:bg-sky-500/50 hover:text-blue-600"
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block text-base">{link.name}</p>
          </Link>
        );
      })}
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
            <div className="hidden md:block text-base">Sign Out</div>
            <ArrowRightStartOnRectangleIcon className="w-6" />
          </button>
        </form>
      )}
    </>
  );
}
