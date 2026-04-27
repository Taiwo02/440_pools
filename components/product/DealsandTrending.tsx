"use client";

import { Card, Progress } from "../ui";
import { useGetBales } from "@/api/bale";
import Link from "next/link";
import { RiFlashlightFill, RiLoader5Line } from "react-icons/ri";
import ProductThumbPlaceholder from "./ProductThumbPlaceholder";
import { useState, useEffect } from "react";
import type { Bale, BaleFilters } from "@/types/types";

type Props = {
  dailyDeals: {
    endsAt: string;
  };
};

function discountPercent(item: Bale): number | null {
  if (item.oldPrice <= item.price || item.oldPrice <= 0) {
    return null;
  }
  return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
}

const getTimeLeft = (endsAt: string) => {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "00:00:00";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

function shortTitle(name: string, max = 28) {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export const DealsAndTrending = ({ dailyDeals }: Props) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    setTimeLeft(getTimeLeft(dailyDeals.endsAt));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dailyDeals.endsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [dailyDeals.endsAt]);

  const [filters] = useState<BaleFilters>({
    categories: [],
    marketLocation: [],
    isSpecial: true,
  });

  const { data: allBales = [], isPending } = useGetBales(filters);
  const dailyDealsBales = allBales.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* SPECIAL DEALS — mobile / tablet only (desktop: DesktopLandingBoard) */}
      <Card className="rounded-t-xl rounded-b-none border-0 shadow-none overflow-hidden p-0! mx-3 lg:hidden">
        {/* Mobile: flash-sales style bar */}
        <div className="lg:hidden flex items-center gap-2 bg-red-600 text-white px-3 py-2.5">
          <RiFlashlightFill className="shrink-0 text-xl" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide leading-tight">
              Special deals
            </p>
            <p className="text-[10px] font-mono opacity-95 tabular-nums">
              TIME LEFT · {timeLeft}
            </p>
          </div>
          <Link
            href="/products?isSpecial=true"
            className="shrink-0 text-xs font-bold underline underline-offset-2"
          >
            See all
          </Link>
        </div>

        {isPending ? (
          <div className="flex justify-center items-center w-full py-16">
            <RiLoader5Line
              size={48}
              className="animate-spin text-(--primary)"
            />
          </div>
        ) : (
          <>
            {/* Mobile horizontal deals */}
            <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 px-3 py-2.5 snap-x snap-mandatory bg-(--bg-page)">
              {dailyDealsBales.map((item) => {
                const pct = discountPercent(item);
                const spotsLeft = Math.max(0, item.slot - item.filledSlot);
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="snap-start shrink-0 w-[min(42vw,9.5rem)] sm:w-[min(38vw,10rem)] block"
                  >
                    <div className="rounded-lg border border-(--border-default) bg-(--bg-surface) overflow-hidden shadow-sm h-full flex flex-col">
                      <div className="relative h-[6.25rem] min-h-[6.25rem] max-h-[6.25rem] w-full overflow-hidden bg-(--bg-muted)">
                        <ProductThumbPlaceholder
                          images={item.product.images}
                          productName={item.product.name}
                          className="h-full w-full min-h-[6.25rem] object-cover"
                          previewMaxChars={12}
                        />
                        {pct != null && (
                          <span className="absolute top-1 left-1 z-10 rounded px-1 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-bold leading-none">
                            -{pct}%
                          </span>
                        )}
                      </div>
                      <div className="p-1.5 flex flex-col flex-1 min-h-0">
                        <p
                          className="text-[10px] font-semibold text-(--text-primary) line-clamp-1 leading-tight"
                          title={item.product.name}
                        >
                          {shortTitle(item.product.name, 26)}
                        </p>
                        <p className="text-(--primary) font-bold text-[11px] mt-1 leading-tight">
                          &#8358;{item.price.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        {item.oldPrice > item.price && (
                          <p className="text-[9px] text-(--text-muted) line-through leading-tight">
                            &#8358;{item.oldPrice.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        )}
                        <p className="text-[9px] text-(--text-muted) mt-0.5 leading-tight">
                          {spotsLeft} left
                        </p>
                        <div className="mt-1">
                          <Progress
                            totalQty={item.slot}
                            currentQty={item.filledSlot}
                            className="my-0!"
                            progClass="h-1!"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Trending section removed for now — pools use tabbed grid in ProductsSection */}
    </div>
  );
};
