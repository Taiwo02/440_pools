"use client"

import { useGetSingleOrder } from "@/api/order"
import { Badge, Button } from "../ui"
import { getOrderStatusVariant } from "./orderStatusBadge"
import { RiLoader4Fill } from "react-icons/ri"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "../ui/table/TableWrapper"
import { Installments, OrderDetails } from "@/types/checkout"

type Props = {
  orderId: number
}

const SingleOrder = ({ orderId }: Props) => {
  const { data: order, isLoading } = useGetSingleOrder(orderId);

  const groupOrderItems = (items: any[]) => {
    const grouped: Record<string, any> = {}

    items.forEach((item) => {
      const productId = item.product.id
      const colorId = item.color?.id ?? "no-color"

      if (!grouped[productId]) {
        grouped[productId] = {
          product: item.product,
          totalQuantity: 0,
          colors: {},
        }
      }

      const productGroup = grouped[productId]
      productGroup.totalQuantity += item.quantity

      if (!productGroup.colors[colorId]) {
        productGroup.colors[colorId] = {
          color: item.color ?? null,
          sizes: [],
        }
      }

      productGroup.colors[colorId].sizes.push({
        size: item.size,
        quantity: item.quantity,
      })
    })

    return Object.values(grouped)
  }

  const formatTimeAgo = (date: string) =>
    formatDistanceToNow(new Date(date), { addSuffix: true })

  const formatFullDate = (date: string) =>
    new Date(date).toLocaleString("en-NG", {
      dateStyle: "long",
      timeStyle: "short",
    })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value)

  if (isLoading) {
    return (
      <div className="h-100 flex justify-center items-center">
        <RiLoader4Fill size={40} className="text-(--primary) animate-spin" />
      </div>
    )
  }

  if (!order) return null

  const groupedProducts = groupOrderItems(order.items)
  const remaining =
    order.order.totalAmount - order.order.amountPaid

  return (
    <div className="max-h-[85vh] flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="border-b border-(--border-default) pb-4 mb-4">
        <div className="flex flex-col gap-1">
          <div>
            <h2 className="text-xl font-bold">
              Order #{order.order.id}
            </h2>
            <p className="text-xs text-(--text-muted)">
              {formatFullDate(order.order.createdAt)} ·{" "}
              {formatTimeAgo(order.order.createdAt)}
            </p>
          </div>

          <Badge
            variant={getOrderStatusVariant(order.order.status)}
            className="font-semibold w-fit"
          >
            {order.order.status.replaceAll("_", " ")}
          </Badge>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">

        {groupedProducts.map((product: any) => (
          <div
            key={product.product.id}
            className="border border-(--border-default) rounded-xl p-4"
          >
            {/* Product Top Section */}
            <div className="flex gap-4">
              <img
                src={product.product.images?.[0]}
                alt={product.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h4 className="font-semibold line-clamp-2">
                  {product.product.name}
                </h4>

                <div className="mt-1 text-sm text-(--text-muted)">
                  Unit Price: {formatCurrency(product.product.price)}
                </div>

                <div className="mt-2 font-semibold text-(--primary)">
                  Total Quantity: {product.totalQuantity}
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="mt-4 space-y-3">
              {Object.values(product.colors).map(
                (colorGroup: any, index: number) => (
                  <div key={index}>
                    {colorGroup.color && (
                      <p className="text-sm font-medium mb-1">
                        Color: {colorGroup.color.color}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {colorGroup.sizes.map(
                        (sizeItem: any, i: number) => (
                          <Badge key={i}>
                            {sizeItem.size?.label} ×{" "}
                            {sizeItem.quantity}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOTER / INVOICE ================= */}
      <div className="border-t border-(--border-default) pt-4 mt-4 space-y-2">
        <h3 className="font-semibold text-lg">Invoice Summary</h3>

        <div className="flex justify-between text-sm">
          <span>Total Amount</span>
          <span className="font-medium">
            {formatCurrency(order.order.totalAmount)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Amount Paid</span>
          <span className="font-medium">
            {formatCurrency(order.order.amountPaid)}
          </span>
        </div>

        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Remaining Balance</span>
          <span className="text-(--primary)">
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {/* Pay Remainder */}
      {
        order.installments.length > 0 &&
          <div className="border-t border-(--border-default) pt-4 mt-4 space-y-2">
            <h3 className="font-semibold text-lg">Remaining Payments</h3>
            <div className="overflow-auto">
              <Table aria-label="Installment Table">
                <TableHeader>
                  <TableRow>
                    <TableColumn>Due Date</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Interest Rate</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    order.installments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="bg-(--bg-muted)">{payment.dueDate}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.interest}</TableCell>
                        <TableCell>
                          <Button className="py-2! px-3! rounded-xl">
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
            
          </div>
      }
      
    </div>
  )
}

export default SingleOrder