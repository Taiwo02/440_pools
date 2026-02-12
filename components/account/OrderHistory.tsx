"use client"

import { Order } from '@/types/types';
import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TablePagination, TableRow } from '../ui/table/TableWrapper';
import { Badge, Button, Dropdown } from '../ui';
import { orders } from './order';

const OrderHistory = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  const suppliers = useMemo(() => {
    return ["all", ...new Set(orders.map(o => o.supplier))];
  }, [orders]);

  const filteredData: Order[] = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Supplier filter
      const matchesSupplier =
        supplierFilter === "all" || order.supplier === supplierFilter;

      // Date range filter
      const orderDate = new Date(order.createdAt);
      const matchesStart =
        !dateRange.start || orderDate >= new Date(dateRange.start);

      const matchesEnd =
        !dateRange.end || orderDate <= new Date(dateRange.end);

      return matchesStatus && matchesSupplier && matchesStart && matchesEnd;
    });
  }, [orders, statusFilter, supplierFilter, dateRange]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // For the badges
  const statusVariantMap: Record<Order["status"],
    "primary" | "secondary" | "success" | "danger"
  > = {
    shipped: "primary",
    delivered: "success",
    processing: "secondary",
    canceled: "danger",
  };

  return (
    <div>
      <div className="bg-(--bg-page) p-3 rounded-2xl mb-6">
        <h3 className="text-xl mb-2">Filters</h3>
        <div className="flex gap-4">
          <div>
            <p className="text-sm font-semibold mb-1">Order Statuses</p>
            <Dropdown
              value={statusFilter}
              options={["all", "shipped", "delivered", "processing", "canceled"]}
              onChange={(e) => {
                setStatusFilter(e as any);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Suppliers</p>
            <Dropdown
              value={supplierFilter}
              options={suppliers}
              onChange={(e) => {
                setSupplierFilter(e);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Date Range */}
          <div className="">
            <p className="text-sm font-semibold mb-1">Start Date</p>
            <input
              type="date"
              onChange={(e) =>
                setDateRange(prev => ({ ...prev, start: e.target.value }))
              }
              className='border border-(--border-default) rounded py-2 px-3 bg-(--bg-surface)'
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold mb-1">End Date</p>
            <input
              type="date"
              onChange={(e) =>
                setDateRange(prev => ({ ...prev, end: e.target.value }))
              }
              className='border border-(--border-default) rounded py-2 px-3 bg-(--bg-surface)'
            />
          </div>

        </div>
      </div>
      <Table aria-label='Order History Table' pageSize={rowsPerPage} className='border border-(--border-default)'>
        <TableHeader>
          <TableRow>
            <TableColumn>Order ID</TableColumn>
            <TableColumn>Pool ID</TableColumn>
            <TableColumn>Product(s)</TableColumn>
            <TableColumn>Supplier</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Units</TableColumn>
            <TableColumn>Total Amount</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            paginatedData.map(order => (
              <TableRow key={order.orderId}>
                <TableCell>{ order.orderId }</TableCell>
                <TableCell>{ order.baleId }</TableCell>
                <TableCell>{ order.productName }</TableCell>
                <TableCell>{ order.supplier }</TableCell>
                <TableCell>{ order.quantity }</TableCell>
                <TableCell>{ order.unit }</TableCell>
                <TableCell>{ order.totalAmount }</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[order.status]} className='font-semibold'>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button className='py-1! px-2! text-sm rounded!'>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <TablePagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex + 1}
        endIndex={endIndex}
        totalItems={filteredData.length}
        itemLabel="orders"
      />
    </div>
  )
}

export default OrderHistory
