"use client"

import { OrderList } from '@/types/checkout'
import { Button, Card, Progress } from '../ui'
import { RiDeleteBinLine, RiGroupFill, RiLoader5Line } from 'react-icons/ri'
import { useGetSingleBale } from '@/api/bale'
import Countdown from '../shared/Countdown'
import { useEffect, useState } from 'react'
import MyModal from '../core/modal'
import SingleOrder from './SingleOrder'

type Props = {
  order: OrderList
}

const OrderCard = ({ order }: Props) => {
  const { data: baleData, isLoading } = useGetSingleBale(String(order.baleId));

  const [selectedOrderID, setSelectedOrderID] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if(baleData) console.log(baleData)
  }, [baleData])
  

  if(isLoading) {
    return (
      <div className="flex justify-center items-center w-full py-10">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    )
  }

  if (!baleData) {
    return null;
  }

  const productsPerSlot =
    baleData.slot > 0
      ? Math.floor(baleData.quantity / baleData.slot)
      : 0;

  const handleClick = (orderId: number) => {
    setSelectedOrderID(orderId);
    setIsModalOpen(true);
  }

  return (
    <Card className='py-3! px-3! mb-3 shadow-none! border'>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={baleData?.product?.images[0]}
            alt={baleData?.product?.name}
            className='object-cover w-full h-full'
          />
        </div>
        <div className="flex flex-1 justify-between gap-2">
          <div>
            <p className='text-sm md:text-lg line-clamp-2 md:line-clamp-1'>
              { baleData?.product?.name }
            </p>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600"
            >
              Quantity: {productsPerSlot}
            </span>
            <div className="relative mb-8 md:mb-0">
              <Countdown endDate={baleData?.endIn} />
            </div>
          </div>
          <div className='text-end shrink-0'>
            <p className="text-xl font-bold">₦ {baleData?.price.toLocaleString()}</p>
            <div className="flex shrink-0 items-center gap-2 justify-end mb-1">
              <p className="text-sm text-gray-400 line-through">
                ₦{baleData?.oldPrice?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-2">
        <div className="flex md:items-end justify-between">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
              <p className="text-(--text-muted)">
                <span className="text-lg md:text-2xl text-(--text-primary) font-bold">{baleData.filledSlot} </span>
                / {baleData.slot} slots reserved
              </p>
            </div>
          </div>
        </div>
        <Progress
          totalQty={baleData.slot}
          currentQty={baleData.filledSlot}
          className='my-0!'
        />
      </div>
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