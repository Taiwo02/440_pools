"use client"

import Link from 'next/link';
import { RiArrowRightSLine, RiLoader5Line, RiSignalWifiErrorLine } from 'react-icons/ri';
import { Button, Card, Progress } from '../ui';
import Image from 'next/image';
import { useGetInfiniteBales } from '@/api/bale';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '../product/ProductCard';
import { BaleFilters } from '@/types/types';

const ProductsSection = () => {
  const [filters, setFilters] = useState<BaleFilters>({
    page: 1,
    limit: 12
  });
  const { 
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
   } = useGetInfiniteBales(filters);

  const allBales =
    data?.pages.flatMap((page) => page.data) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
              <>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 md:gap-4 my-4">
                  {
                    allBales.map(bale => (
                      <ProductCard bale={bale} key={bale.id} />
                    ))
                  }
                </div>
                <div ref={loadMoreRef} className="flex justify-center py-6">
                  {isFetchingNextPage && (
                    <RiLoader5Line size={32} className="animate-spin text-(--primary)" />
                  )}
                </div>
              </>  
        }
      </div>
    </section>
  )
}

export default ProductsSection
