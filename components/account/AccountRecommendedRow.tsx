"use client";

import Link from "next/link";
import { useGetBales } from "@/api/bale";
import { RiLoader5Line } from "react-icons/ri";

export default function AccountRecommendedRow() {
  const { data: bales = [], isPending } = useGetBales({});

  const items = bales.slice(0, 12);

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:mt-10 md:p-6 lg:mt-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">
          Recommended for you
        </h2>
        <Link
          href="/products"
          className="shrink-0 text-sm font-semibold text-(--primary) hover:underline"
        >
          See all &gt;
        </Link>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <RiLoader5Line className="animate-spin text-3xl text-(--primary)" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No pools to show yet. Browse the marketplace.
        </p>
      ) : (
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1">
          {items.map((bale) => {
            const old = bale.oldPrice ?? 0;
            const price = bale.price;
            const pct =
              old > 0 && price < old
                ? Math.round((1 - price / old) * 100)
                : null;
            return (
              <Link
                key={bale.id}
                href={`/products/${bale.id}`}
                className="w-[140px] shrink-0 sm:w-[160px]"
              >
                <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:border-(--primary)/40 hover:shadow-md">
                  {pct != null && pct > 0 && (
                    <span className="absolute right-1.5 top-1.5 z-10 rounded bg-(--primary) px-1.5 py-0.5 text-[10px] font-bold text-white">
                      −{pct}%
                    </span>
                  )}
                  <div className="aspect-square w-full bg-gray-100">
                    {bale.product?.images?.[0] ? (
                      <img
                        src={bale.product.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        Pool
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-medium leading-snug text-gray-900">
                      {bale.product?.name ?? "Product"}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-gray-900">
                      ₦ {price.toLocaleString()}
                    </p>
                    {old > price && (
                      <p className="text-xs text-gray-400 line-through">
                        ₦ {old.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
