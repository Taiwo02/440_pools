"use client";

import React, { useMemo } from "react";
import { useGetUserProfile } from "@/api/auth";
import { useGetDeliveries } from "@/api/order";
import { AccountOverviewCards } from "@/components/account/AccountOverviewCards";
import AccountRecommendedRow from "@/components/account/AccountRecommendedRow";
import RecentlyViewed from "@/components/cart/RecentlyViewed";
import type { DeliveryPayload } from "@/types/types";
import { RiLoader5Line } from "react-icons/ri";

export default function AccountOverviewPage() {
  const { data: person, isPending, error } = useGetUserProfile();
  const { data: deliveries = [] } = useGetDeliveries();

  const defaultAddressLine = useMemo(() => {
    const list = deliveries as DeliveryPayload[];
    const d = list.find((x) => x.setDefault) ?? list[0] ?? null;
    if (!d) {
      return "No saved address yet. Add one for faster checkout.";
    }
    const line = [d.address, d.city, d.region].filter(Boolean).join(" · ");
    return `${d.firstName} ${d.LastName} — ${line} — ${d.countryCode ?? ""} ${d.phone ?? ""}`;
  }, [deliveries]);

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">
        Could not load your profile.
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Account overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your details, addresses, and preferences.
        </p>
      </div>
      <AccountOverviewCards
        person={person}
        defaultAddressLine={defaultAddressLine}
      />
      <AccountRecommendedRow />
      <div id="recently-viewed" className="scroll-mt-24">
        <RecentlyViewed />
      </div>
    </>
  );
}
