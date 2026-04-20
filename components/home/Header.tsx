"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../ui";
import Link from "next/link";
import { RequestQuoteForm } from "@/components/requestForQuot";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategories } from "@/api/product";
import { CategoryDetails } from "@/types/types";
import { RiLoader5Line } from "react-icons/ri";
import MobileMarketplaceStrip from "./MobileMarketplaceStrip";
import HeaderBannerCarousel from "./HeaderBannerCarousel";

const Header = () => {
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const { data: categories, isPending: isCategoriesPending, error: isCategoriesError } = useGetCategories();

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
      <MobileMarketplaceStrip onRequestQuote={() => setIsRfqModalOpen(true)} />
      <header className="hidden md:flex lg:hidden md:h-108 md:pb-0 items-stretch gap-4 px-0 md:px-20 pt-0 md:pt-24">
        <div className="md:w-80 shrink-0">
          <Card className="h-full p-0! overflow-hidden">
            <div className="py-3 px-6 bg-(--bg-muted)">
              <h4 className="text-xl">Categories</h4>
            </div>
            <div className="overflow-y-auto h-full pb-4">
              {
                isCategoriesPending && (
                  <div className="flex items-center justify-center z-10 h-full">
                    <RiLoader5Line className="animate-spin text-(--primary)" size={32} />
                  </div>
                )
              }

              {categories?.map((category: CategoryDetails, index: number) => (
                <Link
                  key={index}
                  href={`/products?category=${category.id}`}
                  className="py-2 px-6 border-b border-(--border-default) flex items-center gap-2"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </Card>
        </div>
        <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden md:rounded-xl">
          <HeaderBannerCarousel
            onRequestQuote={() => setIsRfqModalOpen(true)}
          />
        </div>
      </header>

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
              <RequestQuoteForm handleRfqPopup={() => setIsRfqModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
