"use client";

import { usePathname } from "next/navigation";

/** Drops bottom padding reserved for MobileBottomNav on checkout routes. */
export default function ConditionalMainPadding({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isCheckout = pathname.startsWith("/checkout");

  return (
    <div
      className={
        isCheckout
          ? "min-h-0"
          : "min-h-0 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0"
      }
    >
      {children}
    </div>
  );
}
