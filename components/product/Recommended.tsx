"use client"

import { Button, Card, Progress } from '../ui'
import Link from 'next/link'
import { Bale } from '@/types/types'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  products: Bale[]
}

const Recommended = ({ products }: Props) => {
  return (
    <div className="p-4 rounded-lg bg-(--bg-surface)">
      <h2 className="text-xl font-bold mb-4">Related Pools</h2>

      <div className="relative">
        <Swiper
          slidesPerView={2}
          spaceBetween={8}
          breakpoints={{
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          modules={[Navigation]}
          className="mb-3"
        >
          {products.map(item => (
            <SwiperSlide key={item.id}>
              <Card
                className="border rounded-lg shadow-none! hover:shadow-sm transition p-0!"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-34 mb-2 rounded-t-lg object-cover"
                />
                <div className="px-2 pb-2">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-orange-600 font-semibold text-sm">
                    &#8358;{item.price.toFixed(2)}
                  </p>
                  <div className="flex justify-between items-center flex-wrap mt-2">
                    <p className="font-bold text-(--primary) text-sm">
                      {item.filledSlot}/{item.slot} joined
                    </p>
                  </div>
                  <Progress
                    totalQty={item.slot}
                    currentQty={item.filledSlot}
                    className='my-0!'
                  />
                  <Link href={`/products/${item.id}`}>
                    <Button primary isFullWidth className='mt-2 py-2! rounded-lg!'>
                      Join Pool
                    </Button>
                  </Link>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <button className="custom-prev absolute -left-4 top-[50%] z-10 w-8 h-8 rounded-full bg-(--primary) flex justify-center items-center text-white opacity-50 hover:opacity-100 transition-all cursor-pointer">
          <RiArrowLeftSLine />
        </button>
        <button className="custom-next absolute -right-4 top-[50%] z-10 w-8 h-8 rounded-full bg-(--primary) flex justify-center items-center text-white opacity-50 hover:opacity-100 transition-all cursor-pointer">
          <RiArrowRightSLine />
        </button>
      </div>
    </div>
  )
}

export default Recommended