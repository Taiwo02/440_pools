"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TablePagination, TableRow } from '../ui/table/TableWrapper';
import { Badge, Button, Dropdown } from '../ui';
import { useGetAllOrders } from '@/api/order';
import { ORDER_STATUSES, OrderList, OrderStatus, OrderStatuses } from '@/types/checkout';

const OrderHistory = () => {
  const { data: ordersList = [], isPending: isOrdersLoading } = useGetAllOrders();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (ordersList) console.log(ordersList);
  }, [ordersList])

  const filteredData = useMemo((): OrderList[] => {
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

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      <div className="bg-(--bg-page) p-3 rounded-2xl mb-6">
        <h3 className="text-xl mb-2">Filters</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <p className="text-sm font-semibold mb-1">Order Statuses</p>
            <Dropdown
              value={statusFilter}
              options={ORDER_STATUSES}
              onChange={(value) => {
                setStatusFilter(value as OrderStatuses);
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
            <TableColumn>Checkout ID</TableColumn>
            <TableColumn>Pool ID</TableColumn>
            <TableColumn>Lock Payment ID</TableColumn>
            <TableColumn>Total Amount</TableColumn>
            <TableColumn>Amount Paid</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody isLoading={isOrdersLoading}>
          {
            paginatedData.map(order => (
              <TableRow key={order.id}>
                <TableCell>{ order.checkoutId }</TableCell>
                <TableCell>{ order.baleId }</TableCell>
                <TableCell>
                  {
                    order.lockPaymentId == null ? <span className='text-(--text-muted)'>null</span> : order.lockPaymentId
                  }
                </TableCell>
                <TableCell>
                  {
                    order.totalAmount == null ? <span className='text-(--text-muted)'>null</span> : order.totalAmount
                  }
                </TableCell>
                <TableCell>
                  {
                    order.amountPaid == null ? <span className='text-(--text-muted)'>null</span> : order.amountPaid
                  }
                </TableCell>
                <TableCell>{ order.status }</TableCell>
                <TableCell>{ order.createdAt }</TableCell>
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
        itemLabel="order(s)"
      />
    </div>
  )
}

export default OrderHistory
