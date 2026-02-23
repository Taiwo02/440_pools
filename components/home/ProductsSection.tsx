"use client"

import Link from 'next/link';
import { RiArrowRightSLine, RiLoader5Line, RiSignalWifiErrorLine } from 'react-icons/ri';
import { Button, Card, Progress } from '../ui';
import Image from 'next/image';
import { useGetBales } from '@/api/bale';
import { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';

const ProductsSection = () => {
  const { data: allBales = [], isPending, error } = useGetBales();

  useEffect(() => {
    if (allBales) {
      console.log(allBales);
    }
  }, [allBales]);

  if(error) {
    return (
      <div className="flex justify-center items-center w-full my-16">
        <p className="text-xl">Products not found</p>
      </div>
    )
  }

  return (
    <section className='mb-8'>
      <div className="px-4 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end">
          <div>
            <p className="text-sm font-bold text-(--primary) uppercase">Limited Time</p>
            <h2 className="text-2xl lg:text-3xl">Ongoing Pools</h2>
          </div>
          <Link href={'/products'} className='flex gap-1 items-center text-(--primary)'>
            View all pools
            <RiArrowRightSLine />
          </Link>
        </div>
        {
          isPending ?
            <div className="flex justify-center items-center w-full my-16">
              <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
            </div> : 
            error ? 
              <div className="flex flex-col gap-4 justify-center items-center w-full my-16">
                <RiSignalWifiErrorLine />
                <p className="text-xl">Products not found</p>
              </div> :
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 my-4">
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
