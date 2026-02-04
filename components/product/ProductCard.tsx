import { Bale } from '@/types/types'
import React from 'react'
import { Alert, Button, Card, Progress } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import Countdown from '../shared/Countdown'

type Props = {
  bale: Bale
}

const ProductCard = ({ bale }: Props) => {
  return (
    <Card
      className='p-0!'
    >
      <Image src={bale.product.images[1]} alt='' width={0} height={0} className='w-full h-40 md:h-70 aspect-square rounded-t-2xl object-cover' unoptimized />
      <div className="p-2 md:p-4">
        <p className="md:text-lg font-bold line-clamp-2">{bale.product.name}</p>
        <div className="mt-1">
          <div className="flex flex-wrap gap-1 items-end">
            <p className="text-lg md:text-2xl text-(--primary) font-bold">&#8358;{bale.price}</p>
            <p className="text-(--text-muted) line-through hidden md:block">&#8358;{bale.oldPrice}</p>
          </div>
          <p className="uppercase text-sm hidden md:block">Unit Price (At Goal)</p>
        </div>
        <div className="md:my-2">
          <div className="flex justify-between flex-wrap">
            <p className="font-bold text-(--primary) text-sm">
              {bale.slot - bale.filledSlot}/{ bale.slot } slots
            </p>
            <p className="font-bold text-(--primary) text-sm">{Math.ceil((bale.filledSlot / bale.slot) * 100)}% joined</p>
          </div>
          <Progress
            totalQty={bale.slot}
            currentQty={bale.filledSlot}
            className='my-0!'
          />
        </div>
        <Alert type="success" className="flex flex-row gap-0.5 md:gap-1 items-start md:items-center mt-3 py-1! px-3! text-[8px] md:text-xs! rounded-lg! md:rounded-xl!">
          <p>Ends In:</p>
          <Countdown
            endDate={bale.endIn}
            className='text-[8px] md:text-xs!'
          />
        </Alert>
        <Link href={`/products/${bale.id}`}>
          <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
            Join Pool
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default ProductCard