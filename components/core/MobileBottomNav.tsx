"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHome5Line,
  RiLayoutGridLine,
  RiShoppingCart2Line,
  RiUser6Line,
} from "react-icons/ri";
import { useBuy } from "@/hooks/use-buy";

/** Mobile bottom bar: home, browse, cart, profile */
const items = [
  { href: "/", label: "Home", icon: RiHome5Line, match: (p: string) => p === "/" },
  {
    href: "/products",
    label: "Browse",
    icon: RiLayoutGridLine,
    match: (p: string) => p.startsWith("/products"),
  },
  { href: "/cart", label: "Cart", icon: RiShoppingCart2Line, match: (p: string) => p.startsWith("/cart") },
  {
    href: "/account",
    label: "Me",
    icon: RiUser6Line,
    match: (p: string) => p.startsWith("/account"),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const { buyCart } = useBuy();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-(--border-default) bg-(--bg-surface)/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Primary"
    >
      <div className="grid grid-cols-4 h-14 max-w-lg mx-auto">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          const isCart = href === "/cart";
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? "text-(--primary)" : "text-(--text-muted)"
              }`}
            >
              <span className="relative">
                <Icon className={`text-xl ${active ? "text-(--primary)" : ""}`} aria-hidden />
                {isCart && buyCart.length > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {buyCart.length > 9 ? "9+" : buyCart.length}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
