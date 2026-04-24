"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useGetAllOrders } from "@/api/order";
import type { OrderList, OrderStatus } from "@/types/checkout";
import OrderRowCard from "./OrderRowCard";
import LockedPoolCard from "./LockedPoolCard";
import { TablePagination } from "../ui/table/TableWrapper";
import { RiLoader5Line } from "react-icons/ri";

const CANCELED_STATUSES: OrderStatus[] = [
  "CANCELLED",
  "REFUNDED",
  "DEFAULTED",
  "DISPUTE_RAISED",
];

function isCanceled(order: OrderList): boolean {
  return CANCELED_STATUSES.includes(order.status as OrderStatus);
}

export type OrdersListKind = "ongoing" | "canceled" | "locked";

type Props = {
  /** Route-driven list; each value is its own URL under `/account/orders/...`. */
  list: OrdersListKind;
};

export default function OrderHistory({ list }: Props) {
  const { data: ordersList = [], isPending } = useGetAllOrders();
  const [rowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const lockedPools = useMemo(
    () =>
      ordersList.filter(
        (o) => o.checkoutType === "BALE" && o.status === "LOCKED"
      ),
    [ordersList]
  );

  const activeOrders = useMemo(
    () =>
      ordersList.filter((o) => !isCanceled(o) && o.status !== "LOCKED"),
    [ordersList]
  );

  const canceledOrders = useMemo(
    () => ordersList.filter((o) => isCanceled(o)),
    [ordersList]
  );

  const currentList: OrderList[] =
    list === "ongoing"
      ? activeOrders
      : list === "canceled"
        ? canceledOrders
        : lockedPools;

  useEffect(() => {
    setCurrentPage(1);
  }, [list]);

  const totalPages = Math.ceil(
    Math.max(1, currentList.length) / rowsPerPage
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, currentList.length);
  const paginated = currentList.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track deliveries and finish pool payments.
        </p>
      </div>

      <div className="flex flex-wrap border-b border-gray-200">
        <Link
          href="/account/orders/ongoing"
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
            list === "ongoing"
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          ONGOING / DELIVERED ({activeOrders.length})
        </Link>
        <Link
          href="/account/orders/canceled"
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
            list === "canceled"
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          CANCELED / RETURNED ({canceledOrders.length})
        </Link>
        <Link
          href="/account/orders/locked"
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
            list === "locked"
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          LOCKED POOLS ({lockedPools.length})
        </Link>
      </div>

      {isPending ? (
        <div className="flex justify-center py-20">
          <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
          {list === "locked"
            ? "No locked pools. When you lock a slot and still owe payment, it will appear here."
            : "No orders in this tab yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginated.map((order) =>
            list === "locked" ? (
              <LockedPoolCard key={order.id} order={order} />
            ) : (
              <OrderRowCard key={order.id} order={order} />
            )
          )}

          {currentList.length > rowsPerPage ? (
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={currentList.length === 0 ? 0 : startIndex + 1}
              endIndex={endIndex}
              totalItems={currentList.length}
              itemLabel="order(s)"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
