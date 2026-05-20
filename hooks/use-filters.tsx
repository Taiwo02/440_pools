import { BaleFilters } from "@/types/types";
import { createContext, useContext, useState } from "react";

type FilterContextType = {
  tempFilters: BaleFilters;
  setTempFilters: React.Dispatch<React.SetStateAction<BaleFilters>>;
  filters: BaleFilters;
  setFilters: React.Dispatch<React.SetStateAction<BaleFilters>>;
  updateTempFilters: (
    key: "categories" | "marketLocation" | "productTypes" | "subCategories",
    value: string | number,
    checked: boolean,
  ) => void;
  updateFilters: () => void;
  clearFilters: () => void;
  hasActiveFilters: string | boolean;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<BaleFilters>({
    categories: [],
    subCategories: [],
    productTypes: [],
    priceRange: { min: 0, max: 100000 },
    marketLocation: [],
    limit: 12,
  });

  const [tempFilters, setTempFilters] = useState<BaleFilters>({
    categories: [],
    subCategories: [],
    productTypes: [],
    priceRange: { min: 0, max: 100000 },
    marketLocation: [],
    limit: 12,
  });

  // If filters are active
  const hasActiveFilters =
    (filters.categories?.length ?? 0) > 0 ||
    (filters.marketLocation?.length ?? 0) > 0 ||
    filters.supplierRating ||
    filters.priceRange?.min !== 0 ||
    filters.priceRange?.max !== 99999999;

  // Update temp filters
  const updateTempFilters = (
    key: "categories" | "marketLocation" | "subCategories" | "productTypes",
    value: string | number,
    checked: boolean,
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] || []), value]
        : (prev[key] || []).filter((item: any) => item !== value),
    }));
  };

  // Update filters
  const updateFilters = () => {
    setFilters(tempFilters);
  }

  // Clear filters
  const clearFilters = () => {
    const cleared = {
      categories: [],
      subCategories: [],
      priceRange: { min: 0, max: 99999999 },
      marketLocation: [],
      limit: 12,
    };
    setTempFilters(cleared);
    setFilters(cleared);
  }

  return (
    <FilterContext.Provider
      value={{ tempFilters, setTempFilters, filters, setFilters, updateTempFilters, updateFilters, clearFilters, hasActiveFilters }}
    >
      { children }
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)!;