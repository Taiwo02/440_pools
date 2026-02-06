"use client"

import Link from 'next/link';
import { RiArrowRightSLine, RiLoader5Line } from 'react-icons/ri';
import { Button, Card, Progress } from '../ui';
import Image from 'next/image';
import { useGetBales } from '@/api/bale';
import { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';

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
                  <ProductCard bale={bale} key={bale.id} />
                ))
              }
            </div>
        }
      </div>
    </section>
  )
}

export default ProductsSection
