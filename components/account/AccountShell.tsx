"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { accountBackOrHub } from "@/lib/account-navigation";
import { useGetUserProfile } from "@/api/auth";
import { useAuth } from "@/hooks/use-auth";
import type { Merchant } from "@/types/types";
import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiLoader5Line,
  RiLogoutCircleLine,
  RiMapPinLine,
  RiSettings3Line,
  RiShoppingBag3Line,
  RiShoppingCart2Line,
  RiTruckLine,
  RiUser3Line,
} from "react-icons/ri";
import { toast } from "react-toastify";
import WalletBalance from "@/components/shared/WalletBalance";

function firstName(person: Merchant | undefined): string {
  if (!person?.name?.trim()) return "there";
  return person.name.trim().split(/\s+/)[0] ?? "there";
}

function NavSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-gray-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-600">
      {children}
    </p>
  );
}

function NavRow({
  active,
  icon: Icon,
  label,
  href,
}: {
  active?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 border-0 px-3 py-3 text-left text-sm text-gray-800 transition ${
        active
          ? "bg-gray-100 font-semibold text-gray-900"
          : "hover:bg-gray-50"
      }`}
    >
      <Icon className="shrink-0 text-lg text-gray-600" />
      <span className="min-w-0 flex-1">{label}</span>
      <RiArrowRightSLine className="shrink-0 text-gray-400 lg:hidden" />
    </Link>
  );
}

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/account";
  const router = useRouter();
  const { logout } = useAuth();
  const { data: person, isPending, isError } = useGetUserProfile();

  const isAccountHub =
    pathname === "/account" || pathname === "/account/";
  const isAccountOverview =
    pathname === "/account/overview" || pathname === "/account/overview/";
  const isOrdersSection = pathname.startsWith("/account/orders");
  const isDeliveriesSection = pathname === "/account/deliveries";

  const welcome = useMemo(() => firstName(person), [person]);

  const overviewActive = isAccountOverview;
  const ordersActive = isOrdersSection;
  const deliveriesActive = isDeliveriesSection;

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f5f5f5]">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    );
  }

  if (isError || !person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <p className="text-center text-gray-600">
          We could not load your account. Please refresh or sign in again.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f5f5f5] pb-16 pt-28 lg:pb-12 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: sub-page chrome (back uses history; fallback hub) */}
        {isAccountOverview || isOrdersSection || isDeliveriesSection ? (
          <div className="mb-4 flex items-center gap-3 border-b border-gray-200 bg-white px-1 py-3 lg:mb-0 lg:hidden">
            <button
              type="button"
              onClick={() => accountBackOrHub(router)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-gray-800 hover:bg-gray-100"
              aria-label="Go back"
            >
              <RiArrowLeftLine className="text-xl" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {isOrdersSection
                ? "Orders"
                : isDeliveriesSection
                  ? "Deliveries"
                  : "Account overview"}
            </h1>
          </div>
        ) : null}

        {/* Mobile: welcome only on account hub */}
        {isAccountHub ? (
          <div className="mb-4 space-y-0 lg:hidden">
            <div className="overflow-hidden rounded-lg bg-(--primary) px-4 py-5 text-white shadow-sm">
              <p className="text-lg font-semibold">Welcome, {welcome}</p>
              <p className="mt-1 break-all text-sm opacity-90">
                {person?.email}
              </p>
            </div>
            <div className="border border-t-0 border-gray-200 bg-white px-4 py-3">
              <WalletBalance merchantId={person?.id} />
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Sidebar: full nav on desktop; on mobile only on account hub */}
          <aside
            className={`w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:w-64 lg:shadow-none ${
              isAccountHub ? "" : "hidden lg:block"
            }`}
          >
            <div className="hidden border-b border-gray-100 px-4 py-4 lg:block">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                My account
              </p>
            </div>

            <nav className="lg:py-2">
              <div className="lg:hidden">
                <NavSectionTitle>My account</NavSectionTitle>
              </div>
              <NavRow
                icon={RiUser3Line}
                label="Account overview"
                href="/account/overview"
                active={overviewActive}
              />
              <NavRow
                icon={RiShoppingBag3Line}
                label="Orders"
                href="/account/orders/ongoing"
                active={ordersActive}
              />
              {/* <NavRow
                icon={RiTruckLine}
                label="Deliveries"
                href="/account/deliveries"
                active={deliveriesActive}
              /> */}
              <NavRow
                icon={RiMapPinLine}
                label="Address book"
                href="/checkout/address"
              />
              <Link
                href="/cart"
                className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-50"
              >
                <RiShoppingCart2Line className="shrink-0 text-lg text-gray-600" />
                <span className="min-w-0 flex-1">
                  Cart &amp; recently viewed
                </span>
                <RiArrowRightSLine className="shrink-0 text-gray-400 lg:hidden" />
              </Link>

              <div className="mt-1 lg:mt-2">
                <NavSectionTitle>Account settings</NavSectionTitle>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast.info("Payment settings will be available soon.")
                }
                className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-50"
              >
                <RiSettings3Line className="shrink-0 text-lg text-gray-600" />
                Payment settings
              </button>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 px-3 py-4 text-left text-sm font-semibold text-(--primary) hover:bg-orange-50"
              >
                <RiLogoutCircleLine className="shrink-0 text-lg" />
                Logout
              </button>
            </nav>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
