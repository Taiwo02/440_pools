"use client"

import { useGetBales } from "@/api/bale";
import { Button, Card, Pagination, Progress } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiCheckboxCircleFill, RiGlobeFill, RiGlobeLine, RiGridFill, RiHashtag, RiListUnordered, RiLoader5Line, RiMoneyDollarBoxFill, RiStarFill } from "react-icons/ri";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allBales = [], isPending } = useGetBales();

  if (!allBales || allBales.length === 0) {
    return <p className="text-center font-bold text-xl">No data available</p>;
  }

  // FILTER before pagination
  const filteredData = allBales.filter((row) => {
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
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Fashion
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Electronics
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Machinery
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Luxury
                  </div>
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
                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <input className="w-full p-2 border" />
                    </div>
                    <div className="basis-1/2">
                      <input className="w-full p-2 border" />
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="three">
                <Accordion.Trigger id="three">
                  <div className="flex items-center gap-2">
                    <RiHashtag />
                    <span>Min Order</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="three">
                  <input type="range" min={0} max={10000} className="w-full" />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="four">
                <Accordion.Trigger id="four">
                  <div className="flex items-center gap-2">
                    <RiStarFill />
                    <span>Supplier Rating</span>
                  </div>
                  
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="four">
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    1 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    2 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    3 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    4 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    5 <RiStarFill />
                  </div>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="five">
                <Accordion.Trigger id="five">
                  <div className="flex items-center gap-2">
                    <RiGlobeLine />
                    <span>Market Location</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="five">
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    China
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Japan
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    USA
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Rest of the World
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
                <div className="flex justify-center items-center w-full my-16">
                  <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
                </div> :
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-8">
                    {
                      visibleData.map(bale => (
                        <Card
                          key={bale.id}
                          className='p-0!'
                        >
                          <Image src={bale.product.images[1]} alt='' width={0} height={0} className='w-full h-40 aspect-square rounded-t-2xl object-cover' unoptimized />
                          <div className="p-2 md:p-4">
                            <p className="md:text-lg font-bold truncate">{bale.product.name}</p>
                            <div className="mt-1">
                              <div className="flex flex-wrap items-end">
                                <p className="text-lg md:text-2xl text-(--primary) font-bold">&#8358;{bale.price}</p>
                                <p className="text-(--text-muted) line-through">&#8358;{bale.oldPrice}</p>
                              </div>
                              <p className="uppercase text-sm hidden md:block">Unit Price (At Goal)</p>
                            </div>
                            <div className="my-2">
                              <div className="flex justify-between flex-wrap">
                                <p className="font-bold text-sm hidden md:block">Goal: {bale.quantity} units</p>
                                <p className="font-bold text-(--primary) text-sm">{Math.ceil((bale.filledSlot / bale.slot) * 100)}% joined</p>
                              </div>
                              <Progress
                                totalQty={bale.slot}
                                currentQty={bale.filledSlot}
                                className='my-0!'
                              />
                            </div>
                            <Link href={`/products/${bale.id}`}>
                              <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
                                Join Pool
                              </Button>
                            </Link>
                          </div>
                        </Card>
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

export default Products
