"use client";

import OrderHistory from "@/components/account/OrderHistory";
import type { OrdersListKind } from "@/components/account/OrderHistory";

export default function OrdersListClient({ list }: { list: OrdersListKind }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <OrderHistory list={list} />
    </div>
  );
}
