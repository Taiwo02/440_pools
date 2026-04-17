"use client";

import Link from "next/link";
import type { Merchant } from "@/types/types";
import { RiPencilLine } from "react-icons/ri";
import { toast } from "react-toastify";
import WalletBalance from "@/components/shared/WalletBalance";

export function AccountOverviewCards({
  person,
  defaultAddressLine,
}: {
  person: Merchant;
  defaultAddressLine: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Account details
        </h3>
        <p className="mt-3 font-semibold text-gray-900">{person.name}</p>
        <p className="mt-1 text-sm text-gray-600">{person.email}</p>
        {person.phone ? (
          <p className="mt-2 text-sm text-gray-600">{person.phone}</p>
        ) : null}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Address book
          </h3>
          <Link
            href="/checkout/address"
            className="shrink-0 text-(--primary) hover:opacity-80"
            aria-label="Edit addresses"
          >
            <RiPencilLine className="text-lg" />
          </Link>
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Your default shipping address
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {defaultAddressLine}
        </p>
      </div>

      <WalletBalance merchantId={person.id} variant="card" />

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Newsletter preferences
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Choose which emails you would like to receive from us.
        </p>
        <button
          type="button"
          onClick={() =>
            toast.info("Newsletter preferences will be available soon.")
          }
          className="mt-3 text-sm font-semibold text-(--primary) hover:underline"
        >
          Edit newsletter preferences
        </button>
      </div>
    </div>
  );
}
