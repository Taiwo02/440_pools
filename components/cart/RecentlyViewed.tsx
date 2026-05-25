"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getRecentlyViewedBales,
  type RecentlyViewedBale,
} from "@/lib/recently-viewed-bales";

function discountPercent(price: number, oldPrice: number): number | null {
  if (oldPrice <= 0 || price >= oldPrice) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedBale[]>([]);

  useEffect(() => {
    const load = () => setItems(getRecentlyViewedBales());
    load();
    window.addEventListener("440-recently-viewed-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("440-recently-viewed-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:mt-12 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">
          Recently Viewed
        </h2>
        <Link
          href="/products"
          className="shrink-0 text-sm font-semibold text-(--primary) hover:underline"
        >
          See all &gt;
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          Products you browse will show up here. Start exploring pools on the
          products page.
        </p>
      ) : (
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1">
          {items.map((item) => {
            const pct = discountPercent(item.price, item.oldPrice);
            return (
              <Link
                key={item.baleId}
                href={`/products/${item.baleId}`}
                className="w-35 shrink-0 sm:w-40"
              >
                <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:border-(--primary)/40 hover:shadow-md">
                  {pct != null && pct > 0 && (
                    <span className="absolute right-1.5 top-1.5 z-10 rounded bg-(--primary) px-1.5 py-0.5 text-[10px] font-bold text-white">
                      −{pct}%
                    </span>
                  )}
                  <div className="aspect-square w-full bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-medium leading-snug text-gray-900">
                      {item.name}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-gray-900">
                      ₦ {item.price.toLocaleString()}
                    </p>
                    {item.oldPrice > item.price && (
                      <p className="text-xs text-gray-400 line-through">
                        ₦ {item.oldPrice.toLocaleString()}
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
