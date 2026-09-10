"use client"

import { SingleMarket } from "@/types/types";
import { cn } from "@/components/ui/utils";
import React, { useState } from "react";
import { Button } from "../ui";
import MarketDrawer from "./MarketDrawer";

type Props = {
  market: SingleMarket;
  onClick?: (market: SingleMarket) => void;
  className?: string;
};

const MarketCard = ({ market, onClick, className }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div
      onClick={() => onClick?.(market)}
      className={cn(
        "rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden flex flex-col",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="w-full h-36 bg-(--surface) overflow-hidden">
        {market.image ? (
          <img
            src={market.image}
            alt={market.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-(--text-muted) bg-gray-200">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold truncate">{market.name}</h3>
          <span className="text-xs rounded-full px-2.5 py-1 bg-(--surface) whitespace-nowrap">
            {market.category}
          </span>
        </div>

        <p className="text-sm text-(--text-muted) truncate">{market.address}</p>
        <p className="text-sm text-(--text-muted)">{market.country}</p>
        <Button className="mt-3" onClick={() => setModalOpen(true)}>
          Details
        </Button>
      </div>

      {modalOpen && (
        <MarketDrawer isModalOpen={modalOpen} setIsModalOpen={setModalOpen} marketId={String(market.id)} />
      )}
    </div>
  );
};

export default MarketCard;