"use client";

import type { Bale } from "@/types/types";
import React, { useState } from "react";
import { Card, StarRating } from "../ui";
import Link from "next/link";
import ProductThumbPlaceholder from "./ProductThumbPlaceholder";
import { RiBuilding2Line, RiHeartFill, RiHeartLine } from "react-icons/ri";
import UserBubbles from "./UserBubble";
import Countdown from "../shared/Countdown";
import CardJoinToast from "./CardJoinToast";
import type { SingleBale } from "@/types/baletype";

type Props = {
  bale: SingleBale | Bale;
};

const ProductCard = ({ bale }: Props) => {
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
    <Link href={`/products/${bale.id}`} className="block cursor-pointer">
      <Card className="p-0! rounded-lg rounded-t-2xl">
        <div className="relative">
          <ProductThumbPlaceholder
            images={bale.product.images}
            productName={bale.product.name}
            className="w-full h-28 md:h-44 rounded-t-2xl"
            previewMaxChars={40}
          />
          <Countdown
            endDate={bale.endIn}
            className="left-auto! right-2 top-2"
          />
          <CardJoinToast cardId={bale.id} />
          <span
            className={`absolute right-2 bottom-2 z-20 inline-flex rounded-full bg-white/90 p-1 shadow-sm cursor-pointer transition-colors ${
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
              <RiHeartFill size={18} aria-hidden />
            ) : (
              <RiHeartLine size={18} aria-hidden />
            )}
          </span>
        </div>

        <div className="p-2 md:p-3">
          <p className="text-xs md:text-sm font-bold truncate">
            {bale.product.name}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2 min-w-0">
            <p className="flex items-center gap-1 text-xs text-(--text-muted) min-w-0 flex-1">
              <RiBuilding2Line className="shrink-0" size={14} aria-hidden />
              <span className="truncate">{marketName}</span>
            </p>
            <StarRating
              rating={(bale.product as { rating?: number }).rating ?? 4}
              size={12}
              className="shrink-0 mt-0"
            />
          </div>

          <div className="mt-1">
            <div className="flex justify-between items-center">
              <p className="font-bold text-(--primary) text-xs md:text-sm">
                {bale.filledSlot}/{bale.slot} Units
              </p>
              <UserBubbles count={bale.filledSlot} />
            </div>
            <div className="w-full h-2 rounded-full bg-(--primary-soft)">
              <div
                className="h-full rounded-full bg-(--primary) transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <p className="text-(--text-primary) font-bold text-sm md:text-base leading-tight tabular-nums">
              {currency}
              {bale.price.toLocaleString()}
              <span className="text-[10px] md:text-xs font-normal text-(--text-muted) ml-1">
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

          <span className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-(--primary-soft) text-(--primary) font-semibold text-[10px] md:text-xs py-1.5 md:py-2 pointer-events-none">
            Join Pool
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
