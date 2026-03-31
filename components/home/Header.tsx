"use client";

import React, { useState, useEffect } from "react";
import { Button, Card } from "../ui";
import Image from "next/image";
import { industries } from "./data";
import Link from "next/link";
import { RequestQuoteForm } from "@/components/requestForQuot";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategories } from "@/api/product";
import { CategoryDetails } from "@/types/types";
import { RiLoader5Line } from "react-icons/ri";

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
      <header className="h-110 md:h-120 flex items-stretch gap-4 md:px-20 pt-36 md:pt-24">
        <div className="hidden md:block md:w-80">
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
        <div className="relative h-full w-full flex-1 md:rounded-xl">
          <img
            src="/images/bg1.jpg"
            alt=""
            className="w-full h-full object-cover md:rounded-xl"
          />
          <div className="w-full h-full bg-black/50 absolute top-0 left-0 md:flex flex-col justify-center px-4 lg:px-20 text-white md:rounded-xl pt-6">
            <h1 className="text-3xl lg:text-5xl">
              Join <br /> <span className="text-(--primary)">Africa&apos;s Only</span> <br /> Demand Pool
            </h1>
            <p className="my-2 lg:my-3 max-w-150 font-light">
              Get direct from factory prices without meeting the minimum order requirements. Source from globally verified suppliers.
            </p>
            <Button
              type="button"
              primary
              className="w-fit"
              onClick={() => setIsRfqModalOpen(true)}
            >
              Request For Quotation
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isRfqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRfqModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
