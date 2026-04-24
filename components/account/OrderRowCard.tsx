"use client";

import type { OrderList } from "@/types/checkout";
import { Badge } from "@/components/ui";
import { getOrderStatusVariant } from "./orderStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import MyModal from "@/components/core/modal";
import SingleOrder from "./SingleOrder";
type Props = {
  order: OrderList;
};

export default function OrderRowCard({ order }: Props) {
  const [open, setOpen] = useState(false);

  const image =
    order.checkoutType === "BALE"
      ? order.bale?.product?.images?.[0]
      : order.products?.[0]?.images?.[0];
  const title =
    order.checkoutType === "BALE"
      ? order.bale?.product?.name
      : order.products?.[0]?.name;

  const dateLabel = (() => {
    try {
      return format(new Date(order.createdAt), "dd-MM-yy");
    } catch {
      return "";
    }
  })();

  return (
    <>
      <div className="relative flex gap-4 border border-gray-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-3 top-3 text-sm font-semibold text-(--primary) hover:underline"
        >
          See details
        </button>

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pr-24">
          <p className="line-clamp-2 font-semibold text-gray-900 sm:text-lg">
            {title ?? "Order"}
          </p>
          <p className="mt-1 text-sm text-gray-500">Order {order.id}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant={getOrderStatusVariant(order.status)}
              className="font-semibold uppercase"
            >
              {order.status.replaceAll("_", " ")}
            </Badge>
            {dateLabel ? (
              <span className="text-xs text-gray-500">On {dateLabel}</span>
            ) : null}
          </div>
        </div>
      </div>

      <MyModal isModalOpen={open} setIsModalOpen={setOpen}>
        {open ? <SingleOrder orderId={order.id} /> : null}
      </MyModal>
    </>
  );
}
