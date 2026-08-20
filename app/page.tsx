"use client"

import { Header, DesktopLandingBoard, ProductsSection, SuppliersSection } from "@/components/home";
import { DealsAndTrending } from "@/components/product/DealsandTrending";
import { dailyDeals } from "../components/product/data";
import FirstVisitModal from "@/components/home/FirstVisitModal";
import RFQMobile from "@/components/home/RFQMobile";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { RequestQuoteForm } from "@/components/requestForQuot";

export default function Home() {
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  useEffect(() => {
    if (isRfqModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRfqModalOpen]);

  return (
    <>
      <FirstVisitModal />
      <Suspense fallback={<div>Loading...</div>}>
        <Header openRfq={() => setIsRfqModalOpen(true)} setIsRfqModalOpen={setIsRfqModalOpen} />
      </Suspense>
      <DesktopLandingBoard dailyDeals={dailyDeals} />
      <div className="py-2 md:py-10 lg:pt-2 px-0 md:px-10 lg:px-20 mb-6 md:mb-8 lg:mb-0">
        <DealsAndTrending dailyDeals={dailyDeals} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <RFQMobile openRfq={() => setIsRfqModalOpen(true)} />
      </Suspense>

      {/* <ShopBy /> */}
      <ProductsSection />
      <SuppliersSection />

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