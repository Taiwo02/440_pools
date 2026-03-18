import { Bale } from '@/types/types'
import React from 'react'
import { Card, StarRating } from '../ui'
import Link from 'next/link'
import ProductThumbPlaceholder from './ProductThumbPlaceholder'
import { RiBuilding2Line } from 'react-icons/ri'
import UserBubbles from './UserBubble'
import Countdown from '../shared/Countdown'
import CardJoinToast from './CardJoinToast'

type Props = {
  bale: Bale
}

const ProductCard = ({ bale }: Props) => {
  const percentage = bale.slot > 0 ? Math.round((bale.filledSlot / bale.slot) * 100) : 0
  const marketName = (bale.product as { supplier?: { name?: string } })?.supplier?.name ?? 'Group Pool'
  const hasDiscount = bale.oldPrice != null && bale.oldPrice > bale.price && bale.oldPrice > 0
  const savePercent = hasDiscount ? Math.round(((bale.oldPrice - bale.price) / bale.oldPrice) * 100) : 0

  return (
    <Link href={`/products/${bale.id}`} className="block cursor-pointer">
      <Card className="p-0!">
        {/* 1. Image first - Save % top-left, Countdown top-right */}
        <div className="relative">
          <ProductThumbPlaceholder
            images={bale.product.images}
            productName={bale.product.name}
            className="w-full h-28 md:h-44 rounded-t-2xl"
            previewMaxChars={40}
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium">
              Save {savePercent}%
            </span>
          )}
          <Countdown endDate={bale.endIn} className="!left-auto right-2 top-2" />
          <CardJoinToast cardId={bale.id} />
        </div>

        <div className="p-2 md:p-3">
          {/* 2. Title - single line */}
          <p className="text-xs md:text-sm font-bold truncate">{bale.product.name}</p>
          <StarRating rating={(bale.product as { rating?: number }).rating ?? 4} size={12} className="mt-0.5" />

          {/* 3. Market name */}
          <p className="flex items-center gap-1 text-xs text-(--text-muted) mt-0.5">
            <RiBuilding2Line className="shrink-0" size={14} />
            <span>{marketName}</span>
          </p>

          {/* 4. Progress - left: filledSlot/slot Units, right: avatar icons (3 + +N) */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-(--primary) text-xs md:text-sm">
                {bale.filledSlot}/{bale.slot} Units
              </p>
              <UserBubbles count={bale.filledSlot} />
            </div>
            <div className="w-full h-2 rounded-full bg-(--primary-soft)">
              <div
                className="h-full rounded-full bg-(--primary) transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* 5. Price section: POOL PRICE | RETAIL struck through, then price + Save % badge, Join Pool */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-(--text-muted) uppercase">POOL PRICE</span>
              {hasDiscount && (
                <span className="text-[10px] text-(--text-muted) uppercase line-through">
                  RETAIL: &#8358;{bale.oldPrice}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-2 mt-0.5">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <p className="text-(--text) font-bold text-sm md:text-base">
                  &#8358;{bale.price}
                  <span className="text-(--text-muted) font-normal text-xs">/unit</span>
                </p>
              </div>
              <span className="hidden md:inline-flex shrink-0 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary) font-medium text-xs py-2 px-3 transition-all hover:bg-(--primary) hover:text-white">
                Join Pool
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard