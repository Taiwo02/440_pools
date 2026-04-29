"use client";

import { useGetInfiniteBales } from "@/api/bale";
import { useGetCategories } from "@/api/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { BaleFilters, CategoryDetails } from "@/types/types";
import * as Slider from "@radix-ui/react-slider";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiGlobeLine,
  RiGridFill,
  RiListUnordered,
  RiLoader5Line,
  RiMoneyDollarBoxFill,
  RiSignalWifiErrorLine,
  RiStarFill,
} from "react-icons/ri";
import { TbBoxOff } from "react-icons/tb";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { ProductType, SubCategory } from "@/types/baletype";
import { useFilter } from "@/hooks/use-filters";

type ProductRowProps = {
  category: CategoryDetails;
  tempFilters: BaleFilters;
  toggleFilter: (
    key: "categories" | "subCategories" | "marketLocation" | "productTypes",
    value: string | number,
    checked: boolean,
  ) => void;
  handleEnter: (category: CategoryDetails) => void;
};

const CategoryRow = ({
  category,
  tempFilters,
  toggleFilter,
  handleEnter,
}: ProductRowProps) => {
  const { data: subCategories } = useQuery({
    queryKey: ["sub-category", category.id],
    queryFn: async () => {
      const res = await http.get(
        `/admin/sub-categories-by-categoryId/${category.id}`,
      );
      return res?.data?.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const checked = tempFilters.categories?.includes(category.id);

  return (
    <div onMouseEnter={() => handleEnter(category)} className="relative">
      <label className={`p-2 mb-1 grid grid-cols-3 gap-3 ...`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            toggleFilter("categories", category.id, e.target.checked)
          }
          className="hidden"
        />

        {/* ACCESS SUBCATEGORIES HERE */}
        {subCategories?.map((sub: SubCategory) => {
          const subChecked = tempFilters.subCategories?.includes(sub.id);
          return (
            <div className="my-2" key={sub.id}>
              <label
                className={`font-bold p-2 ${subChecked && "bg-(--primary)/10 text-(--primary) rounded-t-xl"}`}
              >
                <input
                  type="checkbox"
                  value={sub.id}
                  onChange={(e) =>
                    toggleFilter("subCategories", sub.id, e.target.checked)
                  }
                  checked={subChecked}
                  className="hidden"
                />
                <span>{sub.name}</span>
              </label>

              <div className="my-2">
                {sub.productTypes.length == 0 && (
                  <span className="text-sm text-(--text-muted)">
                    No types for this sub-category
                  </span>
                )}
                {sub.productTypes.map((type: ProductType) => {
                  const typeChecked = tempFilters.productTypes?.includes(
                    type.id,
                  );

                  return (
                    <label
                      key={type.id}
                      className={`block cursor-pointer ${typeChecked && "text-(--primary)"}`}
                    >
                      <input
                        type="checkbox"
                        value={type.id}
                        onChange={(e) =>
                          toggleFilter(
                            "productTypes",
                            type.id,
                            e.target.checked,
                          )
                        }
                        checked={typeChecked}
                        className="hidden"
                      />
                      {/* FIXED: changed sub.name to type.name */}
                      <span>{type.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </label>
    </div>
  );
};

const ProductsContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryDetails | null>(
    null,
  );
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

  const {
    data: categories,
    isPending: isCategoriesPending,
    error: isCategoriesError,
  } = useGetCategories();

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => {
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

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const prefetchAll = async () => {
      for (const category of categories) {
        // Prefetch subcategories
        const subCategories = await queryClient.fetchQuery({
          queryKey: ["sub-category", category.id],
          queryFn: async () => {
            const res = await http.get(
              `/admin/sub-categories-by-categoryId/${category.id}`,
            );
            return res?.data?.data;
          },
        });

        // Prefetch product types for each subcategory
        // if (subCategories?.length) {
        //   await Promise.all(
        //     subCategories.map((sub: any) =>
        //       queryClient.prefetchQuery({
        //         queryKey: ["product-types", sub.id],
        //         queryFn: async () => {
        //           const res = await http.get(
        //             `/admin/category/product-types?subCategoryId=${sub.id}`,
        //           );
        //           return res?.data?.data;
        //         },
        //       }),
        //     ),
        //   );
        // }
      }
    };

    prefetchAll();
  }, [categories, queryClient]);

  const {
    filters,
    setFilters,
    tempFilters,
    setTempFilters,
    updateTempFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilter();

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
      { threshold: 0.5, root: scrollContainerRef.current },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const supplierRatings = ["1", "2", "3", "4", "5"];

  const handleEnter = (category: CategoryDetails) => {
    if (!sidebarRef.current) return;

    const rect = sidebarRef.current.getBoundingClientRect();

    setPanelPosition({
      top: rect.top + 20,
      left: rect.right - 45,
    });

    setActiveCategory(category);
  };

  const filteredData = allBales.filter((row) => {
    if (!searchQuery) return true;
    const col1 = row.product.name.toLowerCase();
    const col2 = row.product.description.toLowerCase();
    return (
      col1.includes(searchQuery.toLowerCase()) ||
      col2.includes(searchQuery.toLowerCase())
    );
  });

  if (!isPending && allBales.length === 0 && !hasActiveFilters) {
    return (
      <p className="text-center font-bold text-xl">No products available</p>
    );
  }

  return (
    <>
      <section className="pt-20 lg:pt-24">
        <div className="md:px-10 lg:px-20 flex flex-col md:flex-row gap-8 items-start h-[calc(100vh-6rem)] mb-10">
          <div
            className="hidden lg:flex lg:flex-col basis-full lg:basis-1/5 p-4 rounded-xl bg-(--bg-surface) overflow-y-auto overflow-x-visible h-full relative"
            ref={sidebarRef}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Filters</h2>
              <span
                className="text-(--primary) cursor-pointer text-sm"
                onClick={clearFilters}
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
                      <RiLoader5Line
                        size={24}
                        className="animate-spin text-(--primary)"
                      />
                    </div>
                  ) : categories.length === 0 ? (
                    <div>No categories found</div>
                  ) : (
                    categories.map((category: CategoryDetails) => {
                      const checked = tempFilters.categories?.includes(
                        category.id,
                      );

                      return (
                        <div
                          key={category.id}
                          onMouseEnter={() => setActiveCategory(category)}
                          className="relative"
                        >
                          <label
                            className={`
                              p-2 mb-1 flex items-center gap-2 border-b border-(--border-default)
                              ${checked && "bg-(--primary)/10 text-(--primary) rounded-t-xl"}
                              hover:bg-(--primary)/10 hover:text-(--primary)
                              transition-all cursor-pointer
                            `}
                            onMouseLeave={() => setActiveCategory(null)}
                            onMouseEnter={() => handleEnter(category)}
                          >
                            <input
                              type="checkbox"
                              value={category.id}
                              onChange={(e) =>
                                updateTempFilters(
                                  "categories",
                                  category.id,
                                  e.target.checked,
                                )
                              }
                              checked={checked}
                              className="hidden"
                            />
                            <span className="truncate">{category.name}</span>
                          </label>
                        </div>
                      );
                    })
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
                    value={[
                      tempFilters.priceRange!.min,
                      tempFilters.priceRange!.max,
                    ]}
                    max={99999999}
                    step={1}
                    onValueChange={([min, max]) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        priceRange: { min, max },
                      }))
                    }
                  >
                    <Slider.Track className="relative h-1 w-full bg-gray-300 rounded">
                      <Slider.Range className="absolute h-full bg-(--primary)" />
                    </Slider.Track>

                    {/* Min Thumb */}
                    <Slider.Thumb className="relative block w-4 h-4 bg-(--primary) rounded-full" />
                    <span className="absolute top-5 left-0 -translate-x-1/4 text-[10px] text-gray-700 whitespace-nowrap">
                      {tempFilters.priceRange!.min}
                    </span>

                    {/* Max Thumb */}
                    <Slider.Thumb className="relative block w-4 h-4 bg-(--primary) rounded-full" />
                    <span className="absolute top-5 right-0 translate-x-1/4 text-[10px] text-gray-700 whitespace-nowrap">
                      {tempFilters.priceRange!.max}
                    </span>
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
                          setTempFilters((prev) => ({
                            ...prev,
                            supplierRating: e.target.value,
                          }))
                        }
                        checked={tempFilters.supplierRating?.includes(rating)}
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
                  {["Yiwu", "Guangzhou", "Shenzhen", "Rest of the markets"].map(
                    (loc) => (
                      <div className="my-2 flex items-center gap-2" key={loc}>
                        <input type="checkbox" />
                        {loc}
                      </div>
                    ),
                  )}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            {typeof window !== "undefined" &&
              activeCategory &&
              createPortal(
                <div
                  onMouseEnter={() => setActiveCategory(activeCategory)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className="fixed z-9999 w-150 h-100 lg:w-200 lg:h-120 bg-white border border-(--border-default) rounded-xl shadow-xl p-6 overflow-auto"
                  style={{
                    top: panelPosition.top,
                    left: panelPosition.left,
                  }}
                >
                  <h3 className="font-semibold mb-4">{activeCategory.name}</h3>
                  <CategoryRow
                    key={activeCategory.id}
                    category={activeCategory}
                    tempFilters={tempFilters}
                    toggleFilter={updateTempFilters}
                    handleEnter={handleEnter}
                  />
                </div>,
                document.body,
              )}
            <Button
              primary
              className="mt-5"
              isFullWidth
              onClick={updateFilters}
            >
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
                <span className="text-sm">
                  Found {filteredData.length} products
                </span>
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
            <div
              ref={scrollContainerRef}
              className="p-4 rounded-xl bg-(--bg-surface) overflow-y-auto flex-1"
            >
              {isPending ? (
                <div className="flex items-center justify-center min-h-75">
                  <RiLoader5Line
                    className="animate-spin text-(--primary)"
                    size={60}
                  />
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
                    <p>
                      There are no results for the filter you applied. Please
                      adjust the filters to see more products.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  {filteredData.map((bale) => (
                    <ProductCard bale={bale} key={bale.id} />
                  ))}
                </div>
              )}

              {/* Sentinel lives inside the scroll container */}
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <RiLoader5Line
                    size={32}
                    className="animate-spin text-(--primary)"
                  />
                )}
                {!hasNextPage && filteredData.length > 0 && (
                  <p className="text-sm text-(--text-muted)">
                    You've reached the end
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

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