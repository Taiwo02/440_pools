"use client"

import { useGetInfiniteBales } from "@/api/bale";
import { useGetCategories } from "@/api/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { BaleFilters, CategoryDetails } from "@/types/types";
import * as Slider from '@radix-ui/react-slider';
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { RiArrowDownSLine, RiGlobeLine, RiGridFill, RiListUnordered, RiLoader5Line, RiMoneyDollarBoxFill, RiSignalWifiErrorLine, RiStarFill } from "react-icons/ri";
import { TbBoxOff } from "react-icons/tb";

const ProductsContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BaleFilters>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    marketLocation: [],
    limit: 12,
  });

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? undefined;

  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => {
        const categories = prev.categories ?? [];
        const categoryId = Number(initialCategory);
        return {
          ...prev,
          categories: categories.includes(categoryId)
            ? categories
            : [...categories, categoryId],
        };
      });
    }
  }, [initialCategory]);

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, root: scrollContainerRef.current }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { data: categories, isPending: isCategoriesPending, error: isCategoriesError } = useGetCategories();

  const hasActiveFilters =
    (filters.categories?.length ?? 0) > 0 ||
    (filters.marketLocation?.length ?? 0) > 0 ||
    filters.supplierRating ||
    (filters.priceRange?.min !== 0 || filters.priceRange?.max !== 1000000);

  const toggleFilter = (
    key: "categories" | "marketLocation",
    value: string | number,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
        ? [...prev[key]!, value]
        : prev[key]!.filter((item: any) => item !== value)
    }));
  };

  const supplierRatings = ["1", "2", "3", "4", "5"];

  const filteredData = allBales.filter((row) => {
    if (!searchQuery) return true;
    const col1 = row.product.name.toLowerCase();
    const col2 = row.product.description.toLowerCase();
    return col1.includes(searchQuery.toLowerCase()) || col2.includes(searchQuery.toLowerCase());
  });

  if (!isPending && allBales.length === 0 && !hasActiveFilters) {
    return <p className="text-center font-bold text-xl">No products available</p>;
  }

  return (
    <>
      <section className='pt-24'>
        <div className="md:px-10 lg:px-20 flex flex-col md:flex-row gap-8 items-start h-[calc(100vh-6rem)]">
          <div className="hidden lg:flex lg:flex-col basis-full lg:basis-1/5 p-6 rounded-xl bg-(--bg-surface) overflow-y-auto h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Filters</h2>
              <span
                className="text-(--primary) cursor-pointer"
                onClick={() =>
                  setFilters({ categories: [], priceRange: { min: 0, max: 1000000 }, marketLocation: [], limit: 12 })
                }
              >
                Clear All
              </span>
            </div>
            <Accordion defaultOpenId="one">
              <Accordion.Item id="one">
                <Accordion.Trigger id="one">
                  <div className="flex items-center gap-2">
                    <RiListUnordered />
                    <span>Categories</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="one">
                  {isCategoriesError ? (
                    <div>No categories found</div>
                  ) : isCategoriesPending ? (
                    <div className="my-6">
                      <RiLoader5Line size={24} className='animate-spin text-(--primary)' />
                    </div>
                  ) : categories.length === 0 ? (
                    <div>No categories found</div>
                  ) : (
                    categories.map((category: CategoryDetails, index: number) => (
                      <div className="my-2 flex items-center gap-2" key={index}>
                        <input
                          type="checkbox"
                          value={category.id}
                          onChange={(e) => toggleFilter("categories", category.id, e.target.checked)}
                          checked={filters.categories?.includes(category.id)}
                        />
                        <span className="truncate">{category.name}</span>
                      </div>
                    ))
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="two">
                <Accordion.Trigger id="two">
                  <div className="flex items-center gap-2">
                    <RiMoneyDollarBoxFill />
                    <span>Price Range</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="two">
                  <Slider.Root
                    className="relative flex items-center w-full h-5 my-2"
                    value={[filters.priceRange!.min, filters.priceRange!.max]}
                    max={10000}
                    step={1}
                    onValueChange={([min, max]) =>
                      setFilters(prev => ({ ...prev, priceRange: { min, max } }))
                    }
                  >
                    <Slider.Track className="relative h-1 w-full bg-gray-300 rounded">
                      <Slider.Range className="absolute h-full bg-(--primary)" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-(--primary) rounded-full relative">
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-700">
                        {filters.priceRange!.min}
                      </span>
                    </Slider.Thumb>
                    <Slider.Thumb className="block w-4 h-4 bg-(--primary) rounded-full relative">
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-700">
                        {filters.priceRange!.max}
                      </span>
                    </Slider.Thumb>
                  </Slider.Root>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="three">
                <Accordion.Trigger id="three">
                  <div className="flex items-center gap-2">
                    <RiStarFill />
                    <span>Supplier Rating</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="three">
                  {supplierRatings.map((rating, index) => (
                    <div className="my-2 flex items-center gap-2" key={index}>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setFilters(prev => ({ ...prev, supplierRating: e.target.value }))
                        }
                        checked={filters.supplierRating?.includes(rating)}
                      />
                      {rating} <RiStarFill />
                    </div>
                  ))}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="four">
                <Accordion.Trigger id="four">
                  <div className="flex items-center gap-2">
                    <RiGlobeLine />
                    <span>Market Location</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="four">
                  {["Yiwu", "Guangzhou", "Shenzhen", "Rest of the markets"].map((loc) => (
                    <div className="my-2 flex items-center gap-2" key={loc}>
                      <input type="checkbox" />
                      {loc}
                    </div>
                  ))}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Button primary className="mt-5" isFullWidth>
              Apply
            </Button>
          </div>

          <div className="basis-full lg:basis-4/5 flex flex-col h-full overflow-hidden">
            <div className="p-4 rounded-xl bg-(--bg-surface) hidden md:flex justify-between items-center mb-6 shrink-0">
              <div className="flex gap-2 items-center">
                <span className="text-(--primary)/70">Sort By:</span>
                <ul className="flex items-center gap-2">
                  <li>Popularity</li>
                  <li>Newest</li>
                  <li>Price</li>
                  <li>MOQ</li>
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Found {filteredData.length} products</span>
                <div className="flex border border-(--primary-soft) rounded-lg">
                  <button className="p-2 rounded-l-lg bg-(--primary-soft) text-(--primary)">
                    <RiGridFill />
                  </button>
                  <button className="p-2 rounded-r-lg">
                    <RiListUnordered />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable product container — scroll happens here, not on the page */}
            <div ref={scrollContainerRef} className="p-4 rounded-xl bg-(--bg-surface) overflow-y-auto flex-1">
              {isPending ? (
                <div className="flex items-center justify-center min-h-75">
                  <RiLoader5Line className="animate-spin text-(--primary)" size={60} />
                </div>
              ) : error ? (
                <div className="flex flex-col gap-4 justify-center items-center w-full min-h-75">
                  <RiSignalWifiErrorLine size={48} />
                  <p className="text-xl">Products not found</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="min-h-75 flex justify-center items-center flex-col gap-4 text-center">
                  <TbBoxOff size={48} className="text-(--primary)" />
                  <div className="w-3/4">
                    <h2 className="text-xl">Products Not Found</h2>
                    <p>There are no results for the filter you applied. Please adjust the filters to see more products.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  {filteredData.map(bale => (
                    <ProductCard bale={bale} key={bale.id} />
                  ))}
                </div>
              )}

              {/* Sentinel lives inside the scroll container */}
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <RiLoader5Line size={32} className="animate-spin text-(--primary)" />
                )}
                {!hasNextPage && filteredData.length > 0 && (
                  <p className="text-sm text-(--text-muted)">You've reached the end</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const ProductsPageFallback = () => (
  <div className="flex justify-center items-center w-full min-h-[50vh] pt-24">
    <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
  </div>
);

export default function Products() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
