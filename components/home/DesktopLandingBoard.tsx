"use client";

import { Card, Progress } from "../ui";
import Link from "next/link";
import { useGetCategories } from "@/api/product";
import { useGetBales } from "@/api/bale";
import type { Bale, BaleFilters, CategoryDetails } from "@/types/types";
import { RiLoader5Line } from "react-icons/ri";
import {
  RiShoppingCart2Line,
  RiUser3Line,
  RiHeartLine,
  RiFileList3Line,
  RiCoupon3Line,
  RiArrowRightSLine,
} from "react-icons/ri";
import ProductThumbPlaceholder from "../product/ProductThumbPlaceholder";
import { RequestQuoteForm } from "@/components/requestForQuot";
import { useBuy } from "@/hooks/use-buy";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MarketplaceQuickLinks from "./MarketplaceQuickLinks";

type Props = {
  dailyDeals: { endsAt: string };
};

const getTimeLeft = (endsAt: string) => {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "00:00:00";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

function formatPrice(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function shortTitle(name: string, max = 34) {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export default function DesktopLandingBoard({ dailyDeals }: Props) {
  const { user, authenticated } = useAuth();
  const isLoggedIn = Boolean(user) || authenticated;
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const { data: categories, isPending: categoriesPending } = useGetCategories();
  const [filters] = useState<BaleFilters>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    marketLocation: [],
  });
  const { data: allBales = [], isPending: balesPending } = useGetBales(filters);
  const { buyCart } = useBuy();
  const gridBales: Bale[] = allBales.slice(0, 8);

  useEffect(() => {
    setTimeLeft(getTimeLeft(dailyDeals.endsAt));
    const t = setInterval(() => setTimeLeft(getTimeLeft(dailyDeals.endsAt)), 1000);
    return () => clearInterval(t);
  }, [dailyDeals.endsAt]);

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

  const pending = categoriesPending || balesPending;

  return (
    <>
    <section className="hidden lg:block pt-24 pb-0 px-6 xl:px-20 bg-(--bg-page)">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-[220px_minmax(0,1fr)_240px] gap-4 items-stretch min-h-[min(360px,40vh)]">
          {/* Left — categories */}
          <Card className="p-0! overflow-hidden border border-(--border-default) shadow-sm h-full max-h-[480px] flex flex-col">
            <div className="py-2.5 px-4 bg-(--bg-muted) border-b border-(--border-default)">
              <h2 className="text-sm font-bold text-(--text-primary)">
                All categories
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 py-1">
              {categoriesPending && (
                <div className="flex justify-center py-12">
                  <RiLoader5Line className="animate-spin text-(--primary)" size={28} />
                </div>
              )}
              {categories?.map((category: CategoryDetails, index: number) => (
                <Link
                  key={category.id ?? index}
                  href={`/products?category=${category.id}`}
                  className="block py-2 px-4 text-sm text-(--text-primary) border-b border-(--border-default)/60 hover:bg-(--primary-soft) hover:text-(--primary) transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </Card>

          {/* Center — Special deals grid */}
          <Card className="p-0! overflow-hidden border border-(--border-default) shadow-sm flex flex-col h-full min-h-0">
            <div className="flex items-start justify-between gap-3 px-4 py-2 border-b border-(--border-default) bg-(--bg-muted)/50">
              <div>
                <h2 className="text-base font-bold text-(--text-primary)">
                  Special deals
                </h2>
                <p className="text-xs text-(--text-muted) mt-0.5">
                  Group pools — factory-direct pricing
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-(--text-muted) font-mono tabular-nums">
                  Ends in {timeLeft}
                </span>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-0.5 text-xs font-bold text-(--primary) hover:underline underline-offset-2"
                >
                  View all
                  <RiArrowRightSLine className="shrink-0 text-base" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="p-2.5 flex-1 min-h-0">
              {pending ? (
                <div className="flex justify-center items-center h-52">
                  <RiLoader5Line className="animate-spin text-(--primary)" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 h-full content-start">
                  {gridBales.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className="group flex flex-col rounded-lg border border-(--border-default) bg-(--bg-surface) overflow-hidden hover:border-(--primary) hover:shadow-sm transition-all"
                    >
                      <div className="relative h-[6.75rem] min-h-[6.75rem] max-h-[6.75rem] w-full shrink-0 overflow-hidden bg-(--bg-muted)">
                        <ProductThumbPlaceholder
                          images={item.product.images}
                          productName={item.product.name}
                          className="h-full w-full min-h-[6.75rem] object-cover"
                          previewMaxChars={14}
                        />
                        <span className="absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[11px] font-bold text-white bg-black/55 backdrop-blur-[2px]">
                          &#8358;{formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 p-2 pt-1.5 min-h-0">
                        <p
                          className="text-[14px] leading-tight text-(--text-primary) line-clamp-2 group-hover:text-(--primary)"
                          title={item.product.name}
                        >
                          {shortTitle(item.product.name)}
                        </p>
                        <p className="text-[9px] font-semibold text-(--primary)">
                          {item.filledSlot}/{item.slot} joined
                        </p>
                        <Progress
                          totalQty={item.slot}
                          currentQty={item.filledSlot}
                          className="my-0!"
                          progClass="h-1!"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Right — account / quick actions */}
          <Card className="p-0! overflow-hidden border border-(--border-default) shadow-sm h-full flex flex-col">
            <div className="grid grid-cols-3 gap-px bg-(--border-default) border-b border-(--border-default)">
              {[
                { label: "Deals", icon: RiCoupon3Line, href: "/products" },
                { label: "Saved", icon: RiHeartLine, href: "/account" },
                { label: "Orders", icon: RiFileList3Line, href: "/account" },
              ].map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1 py-3 bg-(--bg-surface) text-(--text-muted) hover:bg-(--primary-soft) hover:text-(--primary) text-[10px] font-medium transition-colors"
                >
                  <Icon className="text-lg" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm text-(--text-primary) hover:text-(--primary)"
              >
                <RiShoppingCart2Line className="text-lg" />
                <span>Cart</span>
                {buyCart.length > 0 && (
                  <span className="ml-auto text-xs font-bold bg-(--primary) text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {buyCart.length}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm text-(--text-primary) hover:text-(--primary)"
              >
                <RiUser3Line className="text-lg" />
                My account
              </Link>
              <button
                type="button"
                onClick={() => setIsRfqModalOpen(true)}
                className="mt-auto w-full text-center rounded-md bg-(--primary) text-white text-sm font-bold py-2.5 hover:opacity-95 transition-opacity"
              >
                Request for quotation
              </button>
              {!isLoggedIn && (
                <Link
                  href="/account"
                  className="w-full text-center rounded-md border-2 border-(--primary) text-(--primary) text-sm font-bold py-2.5 hover:bg-(--primary-soft) transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </Card>
        </div>

        <MarketplaceQuickLinks
          variant="desktop"
          onRequestQuote={() => setIsRfqModalOpen(true)}
        />
      </div>
    </section>

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
            className="relative w-full max-w-4xl max-h-[100dvh] md:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <RequestQuoteForm handleRfqPopup={() => setIsRfqModalOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
