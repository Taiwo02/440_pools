import { Suspense } from "react";
import { RiLoader5Line } from "react-icons/ri";

export const metadata = {
  title: "Checkout — Address",
};

export default function CheckoutAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2">
          <RiLoader5Line size={40} className="animate-spin text-(--primary)" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
