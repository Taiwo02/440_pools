import { Bale } from '@/types/types'
import React from 'react'
import { Alert, Button, Card, Progress } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import Countdown from '../shared/Countdown'
import UserBubbles from './UserBubble'

type Props = {
  bale: Bale
}

const ProductCard = ({ bale }: Props) => {
  const users = [
    { id: "u1", name: "Jeff" },
    { id: "u2", name: "Amaka" },
    { id: "u3", name: "Tunde" },
    { id: "u4", name: "Zainab" }
  ];

  return (
    <Link href={`/products/${bale.id}`}>
      <Card
        className='p-0! rounded-lg'
      >
        <div className="relative">
          <Image src={bale.product.images[1]} alt='' width={0} height={0} className='w-full h-40 rounded-t-lg object-cover' unoptimized />
        </div>
        <Countdown
          endDate={bale.endIn}
        // className='text-[8px] md:text-xs!'
        />
        <div className="p-2">
          <p className="font-semibold line-clamp-2">{bale.product.name}</p>
          <div className="md:my-2">
            <div className="flex justify-between items-center flex-wrap">
              <p className="font-bold text-(--primary) text-sm">
                {bale.filledSlot}/{bale.slot} joined
              </p>
              <UserBubbles count={bale.filledSlot} />
            </div>
            <Progress
              totalQty={bale.slot}
              currentQty={bale.filledSlot}
              className='my-0!'
            />
          </div>
          <div className="mt-1">
            <div className="flex flex-wrap gap-1 items-center">
              <p className="text-lg md:text-2xl text-(--primary) font-bold">&#8358;{bale.price}</p>
              <p className="text-(--text-muted) text-sm">/unit</p>
            </div>
          </div>
          {/* <Link href={`/products/${bale.id}`}>
          <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
            Join Pool
          </Button>
        </Link> */}
        </div>
      </Card>
    </Link>
    
  )
}

export default ProductCard