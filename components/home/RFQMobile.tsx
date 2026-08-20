"use client"

import React, { useEffect, useState } from 'react'
import Img from "@/assets/rfq.jpg";
import { Card } from '../ui';

const RFQMobile = ({ openRfq }: { openRfq: () => void }) => {
  // const searchParams = useSearchParams();
  // const isRfqParam = searchParams.has('RFQ');
  

  // useEffect(() => {
  //   if (isRfqParam) {
  //     setIsRfqModalOpen(true);
  //   }
  // }, [isRfqParam]);

  return (
    <>
      <Card className="flex items-center md:hidden gap-3 mx-3 p-3! border border-(--border-default) -mt-6 mb-4 shadow-none ">
        <img
          src={Img.src}
          alt=""
          className="w-30 aspect-square object-cover rounded-lg"
        />
        <div>
          <h2 className="font-bold">Request for Quotation</h2>
          <p className="text-xs text-(--text-muted) mb-2">
            Get competitive quotes from verified suppliers, tailored to your
            needs.
          </p>
          <button
            type="button"
            onClick={openRfq}
            className="mt-auto w-full text-center rounded-md bg-(--primary) text-white text-sm font-bold py-2 hover:opacity-95 transition-opacity"
          >
            Request for quotation
          </button>
        </div>
      </Card>
    </>
  );
}

export default RFQMobile
