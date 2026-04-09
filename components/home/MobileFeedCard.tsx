"use client";

import Link from "next/link";
import { useState } from "react";
import type { Bale } from "@/types/types";
import type { SingleBale } from "@/types/baletype";
import { Card, StarRating } from "@/components/ui";
import ProductThumbPlaceholder from "@/components/product/ProductThumbPlaceholder";
import UserBubbles from "@/components/product/UserBubble";
import Countdown from "@/components/shared/Countdown";
import CardJoinToast from "@/components/product/CardJoinToast";
import {
  RiBuilding2Line,
  RiHeartFill,
  RiHeartLine,
} from "react-icons/ri";

type Props = {
  bale: Bale | SingleBale;
};

/** Matches desktop ProductCard fields in a compact 2-col grid layout */
export default function MobileFeedCard({ bale }: Props) {
  const [liked, setLiked] = useState(false);
  const percentage =
    bale.slot > 0 ? Math.round((bale.filledSlot / bale.slot) * 100) : 0;
  const marketName =
    (bale.product as { supplier?: { name?: string } })?.supplier?.name ??
    "Group Pool";
  const hasDiscount =
    bale.oldPrice != null && bale.oldPrice > bale.price && bale.oldPrice > 0;
  const currency =
    (bale.product as { currency?: string }).currency ?? "₦";

  return (
    <Link href={`/products/${bale.id}`} className="block cursor-pointer min-w-0">
      <Card className="p-0! rounded-lg border border-(--border-default) shadow-sm active:opacity-95">
        {/* overflow-hidden only on image stack so join toasts are not clipped */}
        <div className="relative overflow-hidden rounded-t-lg">
          <ProductThumbPlaceholder
            images={bale.product.images}
            productName={bale.product.name}
            className="w-full aspect-square object-cover"
            previewMaxChars={28}
          />
          <Countdown
            endDate={bale.endIn}
            className="left-auto! right-1 top-1 scale-[0.85] origin-top-right max-w-[min(100%,5.5rem)]"
          />
          <CardJoinToast cardId={bale.id} />
          <span
            className={`absolute right-1.5 bottom-1.5 z-20 inline-flex rounded-full bg-white/90 p-1 shadow-sm cursor-pointer transition-colors ${
              liked
                ? "text-red-500"
                : "text-(--text-muted) hover:text-red-500"
            }`}
            aria-label={liked ? "Unlike" : "Like"}
            title={liked ? "Unlike" : "Like"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked((v) => !v);
            }}
          >
            {liked ? (
              <RiHeartFill size={16} aria-hidden />
            ) : (
              <RiHeartLine size={16} aria-hidden />
            )}
          </span>
        </div>

        <div className="p-2">
          <p className="text-[11px] font-bold text-(--text-primary) line-clamp-2 leading-snug min-h-8">
            {bale.product.name}
          </p>

          <div className="flex items-center justify-between gap-1.5 mt-1.5 min-w-0">
            <p className="flex items-center gap-1 text-[10px] text-(--text-muted) min-w-0 flex-1">
              <RiBuilding2Line className="shrink-0" size={12} aria-hidden />
              <span className="truncate">{marketName}</span>
            </p>
            <StarRating
              rating={(bale.product as { rating?: number }).rating ?? 4}
              size={11}
              className="shrink-0 mt-0"
            />
          </div>

          <div className="mt-1.5">
            <div className="flex justify-between items-center gap-1">
              <p className="font-bold text-(--primary) text-[10px] tabular-nums">
                {bale.filledSlot}/{bale.slot} Units
              </p>
              <UserBubbles count={bale.filledSlot} />
            </div>
            <div className="w-full h-1.5 rounded-full bg-(--primary-soft) mt-0.5">
              <div
                className="h-full rounded-full bg-(--primary) transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-2 space-y-1.5">
            <p className="text-(--text-primary) font-bold text-base leading-tight tabular-nums">
              {currency}
              {bale.price.toLocaleString()}
              <span className="text-[10px] font-normal text-(--text-muted) ml-1">
                per unit
              </span>
            </p>
            {hasDiscount && (
              <span className="inline-block max-w-full truncate rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                Market: {currency}
                {bale.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-(--primary-soft) text-(--primary) font-semibold text-[10px] py-1.5 pointer-events-none">
            Join Pool
          </span>
        </div>
      </Card>
    </Link>
  );
}
