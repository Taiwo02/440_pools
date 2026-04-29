"use client"

import React from 'react'
// @ts-ignore
import Modal from "react-modal";
import { Button, Input } from '../ui';
import { RiCloseLine, RiLoader5Line, RiStarFill } from 'react-icons/ri';
import { useFilter } from '@/hooks/use-filters';
import { useGetCategories } from '@/api/product';
import { CategoryDetails } from '@/types/types';
import * as Slider from "@radix-ui/react-slider";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { 
    filters, 
    setFilters, 
    tempFilters, 
    setTempFilters, 
    updateTempFilters, 
    updateFilters, 
    clearFilters, 
    hasActiveFilters 
  } = useFilter();

  const { data: categories, isPending: isCategoriesPending, error: isCategoriesError } = useGetCategories();

  const supplierRatings = ["1", "2", "3", "4", "5"];

  const handle = () => {
    updateFilters();
    setIsModalOpen(false);
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Search Modal"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 100,
        },
        content: {
          width: "90%",
          top: "10%",
          left: "5%",
          height: "80%",
          backgroundColor: "var(--bg-page)",
          borderRadius: "10px",
          border: "none",
        },
      }}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute block ml-auto shrink-0 right-4 text-(--text-muted)"
      >
        <RiCloseLine size={20} />
      </button>
      <div className="mt-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-lg mb-.5">Filters</h1>
          <span
            className="text-(--primary) cursor-pointer text-sm"
            onClick={clearFilters}
          >
            Clear All
          </span>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold">Categories</h2>
          <div className="mt-1">
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
                const checked = tempFilters.categories?.includes(category.id);

                return (
                  <div key={category.id} className="relative">
                    <label
                      className={`
                        px-2 py-1 mb-1 flex items-center gap-2 border-b border-(--border-default)
                        ${checked && "bg-(--primary)/10 text-(--primary) rounded-t-xl"}
                        hover:bg-(--primary)/10 hover:text-(--primary)
                        transition-all cursor-pointer
                      `}
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
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold">Price Range</h2>
          <div className="mt-1">
            <Slider.Root
              className="relative flex items-center w-full h-5 my-2"
              value={[tempFilters.priceRange!.min, tempFilters.priceRange!.max]}
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
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold">Supplier Rating</h2>
          <div className="mt-1">
            <Input
              element="input"
              input_type="checkbox"
              value={String(tempFilters.supplierRating)}
              name="supplierRating"
              handler={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  supplierRating: e.target.value,
                }))
              }
              checkboxOptions={supplierRatings.map((rating) => ({
                value: rating,
                node: (
                  <>
                    {rating} <RiStarFill />
                  </>
                ),
              }))}
            />
          </div>
        </div>
        <div className="my-8">
          <h2 className="font-semibold">Market Location</h2>
          <div className="mt-1">
            {["Yiwu", "Guangzhou", "Shenzhen", "Rest of the markets"].map(
              (loc) => (
                <div className="my-2 flex items-center gap-2" key={loc}>
                  <input type="checkbox" />
                  {loc}
                </div>
              ),
            )}
          </div>
        </div>
        <Button
          primary
          className="mt-5"
          isFullWidth
          onClick={handle}
        >
          Apply
        </Button>
      </div>
    </Modal>
  );
}

export default FilterModal