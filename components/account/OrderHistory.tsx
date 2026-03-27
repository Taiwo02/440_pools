"use client";

import React, { useMemo, useState } from "react";
import { Dropdown, Button } from "../ui";
import { useGetAllOrders } from "@/api/order";
import {
  ORDER_STATUSES,
  OrderList,
  OrderStatus,
  OrderStatuses,
} from "@/types/checkout";
import MyModal from "../core/modal";
import SingleOrder from "./SingleOrder";
import OrderCard from "./OrderCard";
import { TablePagination } from "../ui/table/TableWrapper";
import { RiLoader5Line } from "react-icons/ri";

const OrderHistory = () => {
  const { data: ordersList = [], isPending } = useGetAllOrders();

  const [rowsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  // Filtering
  const filteredOrders = useMemo((): OrderList[] => {
    return ordersList.filter((order: OrderList) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const orderDate = new Date(order.createdAt);

      const matchesStart =
        !dateRange.start || orderDate >= new Date(dateRange.start);

      const matchesEnd =
        !dateRange.end || orderDate <= new Date(dateRange.end);

      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [ordersList, statusFilter, dateRange]);

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredOrders.length);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const pooledOrders = ordersList.filter((order: OrderList) => order.checkoutType == "BALE");
  const directOrders = ordersList.filter((order: OrderList) => order.checkoutType == "DIRECT");

  return (
    <div className="space-y-6">

      {/* ---------------- Filters Section ---------------- */}
      <div className="bg-(--bg-page) p-4 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Order History</h3>

        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <Dropdown
              value={statusFilter}
              options={ORDER_STATUSES}
              onChange={(value) => {
                setStatusFilter(value as OrderStatuses);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-fit">
            <div className="w-full md:w-auto">
              <p className="text-sm font-medium">Start Date</p>
              <input
                type="date"
                className="border border-(--border-default) rounded-md px-3 py-2 bg-(--bg-surface) w-full"
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
              />
            </div>

            <div className="w-full md:w-auto">
              <p className="text-sm font-medium">End Date</p>
              <input
                type="date"
                className="border border-(--border-default) rounded-md px-3 py-2 bg-(--bg-surface) w-full"
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          

          <Button
            onClick={() => {
              setStatusFilter("all");
              setDateRange({ start: null, end: null });
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ---------------- Orders Grid ---------------- */}
      {isPending ? (
        <div className="flex justify-center items-center py-20">
          <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-(--text-muted)">
          No orders found.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 my-4 items-start">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}
            </div>

            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={startIndex + 1}
              endIndex={endIndex}
              totalItems={filteredOrders.length}
              itemLabel="order(s)"
            />
          </div>
          <div className="w-full hidden lg:w-96 lg:shrink-0 lg:flex flex-col border border-(--border-muted)/30 rounded-xl shadow p-6">
            <h1 className="text-2xl mb-4">Order Summary</h1>
            <div className="flex items-center justify-between my-2">
              <p className="text-sm font-normal text-gray-600">
                Direct Orders
              </p>
              <p className="text-base font-medium text-gray-900">
                { directOrders.length }
              </p>
            </div>

            <div className="flex items-center justify-between my-2">
              <p className="text-sm font-normal text-gray-600">
                Pooled Orders
              </p>
              <p className="text-base font-medium text-gray-900">
                { pooledOrders.length }
              </p>
            </div>

            <div className="flex items-center justify-between my-2">
              <p className="text-sm font-normal text-gray-600">
                Total Orders
              </p>
              <p className="text-base font-medium text-gray-900">
                { ordersList.length }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Order Details Modal ---------------- */}
      <MyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        {selectedOrderID && (
          <SingleOrder orderId={selectedOrderID} />
        )}
      </MyModal>
    </div>
  );
};

export default OrderHistory;