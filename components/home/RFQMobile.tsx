"use client"

import React, { useEffect, useState } from 'react'
import Img from "@/assets/rfq.jpg";
import { Card } from '../ui';
import { AnimatePresence, motion } from 'framer-motion';
import { RequestQuoteForm } from '../requestForQuot';
import { useSearchParams } from 'next/navigation';

const RFQMobile = () => {
  const searchParams = useSearchParams();
  const isRfqParam = searchParams.has('RFQ');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  useEffect(() => {
    if (isRfqParam) {
      setIsRfqModalOpen(true);
    }
  }, [isRfqParam]);

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
            onClick={() => setIsRfqModalOpen(true)}
            className="mt-auto w-full text-center rounded-md bg-(--primary) text-white text-sm font-bold py-2 hover:opacity-95 transition-opacity"
          >
            Request for quotation
          </button>
        </div>
      </Card>

      <AnimatePresence>
        {isRfqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9998 flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRfqModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-dvh md:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <RequestQuoteForm
                handleRfqPopup={() => setIsRfqModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RFQMobile
