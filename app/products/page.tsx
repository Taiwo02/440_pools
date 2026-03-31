"use client"

import { useGetBales } from "@/api/bale";
import { useGetCategories, useGetMarkets } from "@/api/product";
import ProductCard from "@/components/product/ProductCard";
import { Button, Card, Pagination, Progress } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { BaleFilters, CategoryDetails } from "@/types/types";
import * as Slider from '@radix-ui/react-slider';
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { RiArrowDownSLine, RiCheckboxCircleFill, RiGlobeFill, RiGlobeLine, RiGridFill, RiHashtag, RiListUnordered, RiLoader5Line, RiMoneyDollarBoxFill, RiSignalWifiErrorLine, RiStarFill } from "react-icons/ri";
import { TbBoxOff } from "react-icons/tb";

const ProductsContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<BaleFilters>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    marketLocation: []
  });

  const searchParams = useSearchParams();

  // Product parameters
  const endsToday = searchParams.get('daily_deals');
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

  const { data: allBales = [], isPending, error } = useGetBales(filters);
  const { data: categories, isPending: isCategoriesPending, error: isCategoriesError } = useGetCategories();

  const hasActiveFilters =
    (filters.categories?.length ?? 0) > 0 ||
    (filters.marketLocation?.length ?? 0) > 0 ||
    filters.supplierRating ||
    (filters.priceRange?.min !== 0 || filters.priceRange?.max !== 1000000);

  if (!isPending && allBales.length === 0 && !hasActiveFilters) {
    return <p className="text-center font-bold text-xl">No products available</p>;
  }

  // Handler for categories, markets and supplier rating
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
    }))
  }

  const supplierRatings = ["1", "2", "3", "4", "5"];

  // FILTER before pagination
  const filteredData = allBales?.filter((row) => {
    // check first 2 available columns
    const col1 = row.product.name.toLowerCase() || "";
    const col2 = row.product.description.toLowerCase() || "";

    return (
      col1.includes(searchQuery.toLowerCase()) ||
      col2.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleData = filteredData.slice(startIndex, endIndex);

  const prevDisable = currentPage === 1;
  const nextDisable = currentPage === totalPages;


  return (
    <>
      <section className='pt-24 mb-10 md:mb-16'>
        <div className="md:px-10 lg:px-20 flex flex-col md:flex-row gap-8 items-start">
          <div className="hidden lg:block basis-full lg:basis-1/5 p-6 rounded-xl bg-(--bg-surface)">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Filters</h2>
              <span className="text-(--primary)">Clear All</span>
              
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
                  {
                    isCategoriesError ?
                      <div className="">
                        No categories found
                      </div> :
                      isCategoriesPending ?
                        <div className="my-6">
                          <RiLoader5Line size={24} className='animate-spin text-(--primary)' />
                        </div> :
                        categories.length == 0 ?
                          <div className="">
                            No categories found
                          </div> : 
                          categories.map((category: CategoryDetails, index: number) => (
                            <div className="my-2 flex items-center gap-2" key={index}>
                              <input
                                type="checkbox"
                                value={category.id}
                                onChange={(e) =>
                                  toggleFilter(
                                    "categories",
                                    category.id,
                                    e.target.checked
                                  )
                                }
                                checked={filters.categories?.includes(category.id)}
                              />
                              <span className="truncate">{category.name}</span>
                            </div>
                          ))
                  }
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
                    onValueChange={([min, max]) => {
                      setFilters(prev => ({
                        ...prev,
                        priceRange: { min, max }
                      }))
                    }}
                  >
                    {/* Track */}
                    <Slider.Track className="relative h-1 w-full bg-gray-300 rounded">
                      <Slider.Range className="absolute h-full bg-(--primary)" />
                    </Slider.Track>

                    {/* Min Thumb */}
                    <Slider.Thumb className="block w-4 h-4 bg-(--primary) rounded-full relative">
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-700">
                        {filters.priceRange!.min}
                      </span>
                    </Slider.Thumb>

                    {/* Max Thumb */}
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
                  {
                    supplierRatings.map((rating, index) => (
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
                    ))
                  }
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
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Yiwu
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Guangzhou 
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Shenzhen
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Rest of the markets
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Button primary className="mt-5" isFullWidth>
              Apply
            </Button>
          </div>
          <div className="basis-full lg:basis-4/5">
            <div className="p-4 rounded-xl bg-(--bg-surface) hidden md:flex justify-between items-center mb-6">
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
                <span className="text-sm">Found { filteredData.length } products</span>
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
            <div className="p-4 rounded-xl bg-(--bg-surface)">
              {
                isPending ?
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                    <RiLoader5Line className="animate-spin text-(--primary)" size={60} />
                  </div> :
                error ? 
                  <div className="flex flex-col gap-4 justify-center items-center w-full h-screen">
                    <RiSignalWifiErrorLine />
                    <p className="text-xl">Products not found</p>
                  </div>: 
                  visibleData.length == 0 ? 
                    <div className="min-h-75 flex justify-center items-center flex-col gap-4 text-center">
                      <TbBoxOff size={48} className="text-(--primary)" />
                      <div className="w-3/4">
                        <h2 className="text-xl">Products Not Found</h2>
                        <p>
                          There are no results for the filter you just put in. Please adjust the filters to see more products
                        </p>
                      </div>
                      
                    </div> :
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                      {
                        visibleData.map(bale => (
                          <ProductCard bale={bale} key={bale.id} />
                        ))
                      }
                    </div>
              }
            </div>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              prevDisable={prevDisable}
              nextDisable={nextDisable}
              prev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              next={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        </div>
      </section>
    </>
  )
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
