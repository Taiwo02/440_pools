"use client";

import Link from "next/link";
import { RiArrowRightSLine, RiLoader5Line } from "react-icons/ri";
import { useGetInfiniteBales } from "@/api/bale";
import { useGetCategories } from "@/api/product";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../product/ProductCard";
import MobileFeedCard from "./MobileFeedCard";
import type { BaleFilters, CategoryDetails } from "@/types/types";

const POOL_TABS: { id: string; label: string; matchName?: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "fashion", label: "Fashion", matchName: "Fashion" },
  { id: "electronics", label: "Electronics", matchName: "Electronics" },
  { id: "home", label: "Home & living", matchName: "Home" },
  { id: "beauty", label: "Beauty", matchName: "Beauty" },
  { id: "groceries", label: "Groceries", matchName: "Groceries" },
  { id: "sports", label: "Sports", matchName: "Sports" },
];

function resolveCategoryIds(
  categories: CategoryDetails[] | undefined,
  matchName: string
): number[] {
  if (!categories?.length) return [];
  const needle = matchName.toLowerCase().trim();
  const byExact = categories.find((c) => c.name?.toLowerCase() === needle);
  if (byExact?.id != null) return [Number(byExact.id)];
  const byIncludes = categories.find(
    (c) =>
      c.name &&
      (c.name.toLowerCase().includes(needle) || needle.includes(c.name.toLowerCase()))
  );
  return byIncludes?.id != null ? [Number(byIncludes.id)] : [];
}

const ProductsSection = () => {
  const [activeTabId, setActiveTabId] = useState("trending");
  const { data: categories } = useGetCategories();

  const filters = useMemo((): BaleFilters => {
    const base: BaleFilters = { page: 1, limit: 12 };
    if (activeTabId === "trending") return base;
    const tab = POOL_TABS.find((t) => t.id === activeTabId);
    if (!tab?.matchName) return base;
    const ids = resolveCategoryIds(categories, tab.matchName);
    if (ids.length === 0) return base;
    return { ...base, categories: ids };
  }, [activeTabId, categories]);

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteBales(filters);

  const allBales = data?.pages.flatMap((page) => page.data) ?? [];

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

  if (error) {
    return (
      <div className="flex justify-center items-center w-full my-16">
        <p className="text-xl">Products not found</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="px-2 sm:px-4 md:px-10 lg:px-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 border-b border-(--border-default) pb-3 mb-3 lg:mb-4">
          <nav
            className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-0.5 px-0.5 py-0.5"
            aria-label="Pool categories"
          >
            {POOL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`shrink-0 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                  activeTabId === tab.id
                    ? "bg-(--primary) text-white shadow-sm"
                    : "bg-(--bg-muted) text-(--text-muted) border border-transparent hover:border-(--primary)/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <Link
            href="/products"
            className="flex gap-1 items-center text-(--primary) text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap"
          >
            View all
            <RiArrowRightSLine />
          </Link>
        </div>
        {isPending ? (
          <div className="flex justify-center items-center w-full my-16">
            <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-2 md:gap-4 my-2 lg:my-4">
              {allBales.map((bale) => (
                <div key={bale.id} className="min-w-0">
                  <div className="lg:hidden">
                    <MobileFeedCard bale={bale} />
                  </div>
                  <div className="hidden lg:block">
                    <ProductCard bale={bale} />
                  </div>
                </div>
              ))}
            </div>
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {isFetchingNextPage && (
                <RiLoader5Line size={32} className="animate-spin text-(--primary)" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
