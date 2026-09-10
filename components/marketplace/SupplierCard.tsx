"use client"
import { SingleSupplier } from "@/types/types";
import { cn } from "@/components/ui/utils";
import React, { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import { Button } from "../ui";
import SupplierDrawer from "./SupplierDrawer";

type Props = {
  supplier: SingleSupplier;
  onClick?: (supplier: SingleSupplier) => void;
  className?: string;
};

const SupplierCard = ({ supplier, onClick, className }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div
      onClick={() => onClick?.(supplier)}
      className={cn(
        "rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden flex flex-col",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="w-full h-36 bg-(--surface) overflow-hidden relative">
        {supplier.image ? (
          <img
            src={supplier.image}
            alt={supplier.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-(--text-muted)">
            No image
          </div>
        )}

        {supplier.rate && (
          <div className="absolute flex gap-1 items-center top-2 right-2 bg-(--primary) text-white rounded-full px-2 py-1 text-xs font-semibold">
            {supplier.rate} <RiStarFill />
          </div>
        )}
        {supplier.returnRate && (
          <div className="absolute flex gap-1 items-center bottom-2 right-2 bg-(--primary) text-white rounded-full px-2 py-1 text-xs font-semibold">
            {supplier.returnRate}% return rate
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold truncate">{supplier.name}</h3>
          <span className="text-xs text-(--text-muted) whitespace-nowrap">
            {supplier.clubCode}
          </span>
        </div>

        <p className="text-sm text-(--text-muted) truncate">
          {supplier.description}
        </p>
        <p className="text-sm text-(--text-muted)">{supplier.location}</p>

        {/* {supplier.market?.name && (
          <p className="text-xs text-(--text-muted)">
            Market: {supplier.market.name}
          </p>
        )} */}

        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="rounded-full px-2.5 py-1 bg-(--surface) text-xs">
            {supplier.supplierType}
          </span>
        </div>
        <Button className="mt-3" onClick={() => setModalOpen(true)}>
          Details
        </Button>
      </div>

      {modalOpen && (
        <SupplierDrawer
          isModalOpen={modalOpen}
          setIsModalOpen={setModalOpen}
          supplierId={String(supplier.id)}
        />
      )}
    </div>
  );
};

export default SupplierCard;