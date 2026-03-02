"use client"

import { useGetSingleOrder } from "@/api/order"
import { useEffect } from "react"
import { Badge } from "../ui"
import { getOrderStatusVariant } from "./orderStatusBadge"
import { RiLoader4Fill } from "react-icons/ri"
import { formatDistanceToNow } from "date-fns";

type Props = {
  orderId: number
}



const SingleOrder = ({ orderId }: Props) => {
  const { data: order, isLoading } = useGetSingleOrder(orderId);
  useEffect(() => {
    if(order) console.log(order);
  }, [order]);

  const groupOrderItems = (items: any[]) => {
    const grouped: Record<string, any> = {};

    items.forEach((item) => {
      const productId = item.product.id;
      const colorId = item.color?.id ?? "no-color";

      if (!grouped[productId]) {
        grouped[productId] = {
          product: item.product,
          totalQuantity: 0,
          colors: {},
        };
      }

      const productGroup = grouped[productId];
      productGroup.totalQuantity += item.quantity;

      if (!productGroup.colors[colorId]) {
        productGroup.colors[colorId] = {
          color: item.color ?? null,
          sizes: [],
        };
      }

      productGroup.colors[colorId].sizes.push({
        size: item.size,
        quantity: item.quantity,
      });
    });

    return Object.values(grouped);
  };

  const formatTime = (date: string) => {
    const orderDate = new Date(date);
    const result = formatDistanceToNow(orderDate, { addSuffix: true });
    return result;
  }

  const formatDate = (date: Date) => {
    const formatted = date.toLocaleString("en-NG", {
      dateStyle: "long",
      timeStyle: "short",
    });
    return formatted;
  }

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <RiLoader4Fill size={48} className="text-(--primary) animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-auto">
      <div className="pb-4 border-b border-(--border-default)">
        <h3 className="text-xl font-bold">Order ID #{orderId}</h3>
        <div className="my-1">
          <Badge variant={getOrderStatusVariant(order?.order?.status)} className="font-semibold">
            {order.order.status.replaceAll("_", " ")}
          </Badge>
        </div>
        <p className="text-(--text-muted) text-xs capitalize">{formatDate(new Date(order.order.createdAt))} ({formatTime(order.order.createdAt)})</p>
      </div>
      <div className="py-3 border-b border-(--border-default)">
        <h3 className="text-lg font-bold">Order Item(s)</h3>
        {groupOrderItems(order.items).map((product: any) => (
          <div key={product.product.id} className="mb-6">

            {/* Product name + total quantity together */}
            <div className="flex gap-3 items-start">
              <img src={product.product.images[0]} alt="" className="w-17 aspect-square object-cover rounded-full" />
              <div>
                <h4 className="font-semibold line-clamp-2">{product.product.name}</h4>
                <p className="font-bold text-(--primary)">Total Quantity: {product.totalQuantity}</p>
              </div>
            </div>

            {/* Colors */}
            <div className="flex gap-4">
              {Object.values(product.colors).map((colorGroup: any, index) => (
                <div key={index} className="ml-4 mt-2">

                  {colorGroup.color && (
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">
                      Color: {colorGroup.color.color}
                    </p>
                  )}

                  {/* Sizes */}
                  <div className="ml-4 text-sm text-gray-600 flex gap-2 flex-wrap">
                    {colorGroup.sizes.map((sizeItem: any, i: number) => (
                      <Badge key={i} className="font-semibold">
                        {sizeItem.size?.label} × {sizeItem.quantity}
                      </Badge>
                    ))}
                  </div>

                </div>
              ))}
            </div>
            

          </div>
        ))}
      </div>
      <div className="py-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold">Invoice</h3>
          <span className="font-semibold text-lg">(&#8358;)</span>
        </div>
        <div className="flex justify-between items-end">
          <p>Total Amount</p>
          <span className="font-semibold text-lg">{order.order.totalAmount}</span>
        </div>
        <div className="flex justify-between items-end border-b pb-2">
          <p>Amount Paid</p>
          <span className="font-semibold text-lg">{order.order.amountPaid}</span>
        </div>
        <div className="flex justify-between items-end py-1">
          <p>Remaining Amount</p>
          <span className="font-semibold text-lg">{order.order.totalAmount - order.order.amountPaid}</span>
        </div>
      </div>
    </div>
  )
}

export default SingleOrder