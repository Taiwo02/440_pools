"use client"

import { OrderList } from '@/types/checkout'
import { Button, Card, Progress } from '../ui'
import Countdown from '../shared/Countdown'
import { useState } from 'react'
import MyModal from '../core/modal'
import SingleOrder from './SingleOrder'

type Props = {
  order: OrderList
}

const OrderCard = ({ order }: Props) => {
  const [selectedOrderID, setSelectedOrderID] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (orderId: number) => {
    setSelectedOrderID(orderId);
    setIsModalOpen(true);
  }

  const totalQuantity = order.products?.reduce(
    (sum, p) => sum + p.quantity,
    0
  ) ?? 0;

  return (
    <Card className='py-3! px-3! mb-3 shadow-none! border'>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={order.checkoutType == "BALE" ? order.bale?.product?.images?.[0] : order.products?.[0]?.images?.[0]}
            alt={order.checkoutType == "BALE" ? order.bale?.product?.name : order.products?.[0]?.name}
            className='object-cover w-full h-full'
          />
        </div>
        <div className="flex flex-1 justify-between gap-2">
          <div>
            <p className='text-sm md:text-lg line-clamp-2 md:line-clamp-1'>
              { order.checkoutType == "BALE" ? order.bale?.product?.name : order.products?.[0]?.name }
            </p>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600"
            >
              Quantity: { order.checkoutType == "BALE" ? order.totalItemsInOrder : totalQuantity}
            </span>
            {
              order.checkoutType == "BALE" ?
                <div className="relative mb-8 md:mb-0">
                  <Countdown endDate={order?.bale?.endDate!} />
                </div> : 
                <div className='my-2 flex flex-wrap gap-2'>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600"
                  >
                    Payment Option: {order.paymentOption}
                  </span>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600"
                  >
                    Upfront Percentage: {order.upfrontPercent}%
                  </span>
                </div>
            }
          </div>
          <div className='text-end shrink-0'>
            <p className="text-xl font-bold">₦{ order.checkoutType == "BALE" ? order.bale?.price?.toLocaleString(): order?.products?.[0]?.totalPrice  }</p>
          </div>
        </div>
      </div>
      {
        order.checkoutType == "BALE" ? 
          <div className="my-2">
            <div className="flex md:items-end justify-between">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                  <p className="text-(--text-muted)">
                    <span className="text-lg md:text-2xl text-(--text-primary) font-bold">{order.bale?.filledSlots} </span>
                    / {order.bale?.slots} slots reserved
                  </p>
                </div>
              </div>
            </div>
            <Progress
              totalQty={order.bale?.slots!}
              currentQty={order.bale?.filledSlots!}
              className='my-0!'
            />
          </div> : 
         null
      }
      <div className="flex flex-col-reverse md:flex-row justify-between md:items-center mt-2">
        <div className="flex gap-3 mt-3">
          <Button primary className='' onClick={() => handleClick(order.id)}>
            Details
          </Button>
        </div>
      </div>

      <MyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <SingleOrder orderId={selectedOrderID} />
      </MyModal>
    </Card>
  )
}

export default OrderCard