"use client"

import Link from 'next/link';
import { RiArrowRightSLine, RiLoader5Line } from 'react-icons/ri';
import { Button, Card, Progress } from '../ui';
import Image from 'next/image';
import { useGetBales } from '@/api/bale';
import { useEffect, useState } from 'react';

const ProductsSection = () => {
  const { data: allBales = [], isPending } = useGetBales();

  useEffect(() => {
    if (allBales) {
      console.log(allBales);
    }
  }, [allBales]);

  return (
    <section className='my-8 md:my-8'>
      <div className="px-4 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end">
          <div>
            <p className="text-sm font-bold text-(--primary) uppercase">Limited Time</p>
            <h2 className="text-2xl lg:text-3xl">Featured Bulk Deals</h2>
          </div>
          <Link href={''} className='flex gap-1 items-center text-(--primary)'>
            View all active bales
            <RiArrowRightSLine />
          </Link>
        </div>
        {
          isPending ?
            <div className="flex justify-center items-center w-full my-16">
              <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
            </div> :
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 my-4">
              {
                allBales.map(bale => (
                  <Card
                    key={bale.id}
                    className='p-0!'
                  >
                    <img src={bale.product.images[1]} alt='' width={0} height={0} className='w-full h-40 aspect-square rounded-t-2xl object-cover' />
                    <div className="p-2 md:p-4">
                      <p className="md:text-lg font-bold truncate">{bale.product.name}</p>
                      <div className="mt-1">
                        <div className="flex flex-wrap items-end">
                          <p className="text-lg md:text-2xl text-(--primary) font-bold">&#8358;{bale.price}</p>
                          <p className="text-(--text-muted) line-through">&#8358;{bale.oldPrice}</p>
                        </div>
                        <p className="uppercase text-sm hidden md:block">Unit Price (At Goal)</p>
                      </div>
                      <div className="my-2">
                        <div className="flex justify-between flex-wrap">
                          <p className="font-bold text-sm hidden md:block">Goal: {bale.quantity} units</p>
                          <p className="font-bold text-(--primary) text-sm">{Math.ceil((bale.filledSlot / bale.slot) * 100)}% joined</p>
                        </div>
                        <Progress
                          totalQty={bale.slot}
                          currentQty={bale.filledSlot}
                          className='my-0!'
                        />
                      </div>
                      <Link href={`/products/${bale.id}`}>
                        <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
                          Join Pool
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              }
            </div>
        }
      </div>
    </section>
  )
}

export default ProductsSection
