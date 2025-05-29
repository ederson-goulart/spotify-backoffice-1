"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
}

interface Navigation {
  type?: string;
  navigation: NavigationItem[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav({ navigation, type = "desktop" }: Navigation) {
  const pathname = usePathname();

  return (
    <>
      {navigation.map((item) =>
        type === "desktop" ? (
          <Link
            key={item.name}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={classNames(
              pathname === item.href
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "rounded-md px-3 py-2 text-sm font-medium",
            )}
          >
            {item.name}
          </Link>
        ) : type === "humburguer" ? (
          <Link
            key={item.name}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={classNames(
              pathname === item.href
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "block rounded-md px-3 py-2 text-base font-medium",
            )}
          >
            {item.name}
          </Link>
        ) : null,
      )}
    </>
  );
}
