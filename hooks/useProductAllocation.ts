import { useState } from "react";
import { AllocationState } from "@/types/types";

export const useProductAllocation = (baleData: any) => {
  const [allocations, setAllocations] = useState<AllocationState>({});
  const [activeColorId, setActiveColorId] = useState<number | null>(null);

  const hasSizes = baleData?.product?.productSizes?.length > 0;

  const totalAllocatedQuantity = Object.values(allocations).reduce(
    (sum, color) => {
      if (hasSizes) {
        return (
          sum +
          Object.values(color.sizes).reduce(
            (s, size) => s + size.quantity,
            0
          )
        );
      }

      return sum + (color.quantity ?? 0);
    },
    0
  );

  const increaseColorQty = (colorId: number) => {
    setAllocations(prev => {
      const existing = prev[colorId] ?? {
        colorId,
        sizes: {},
        quantity: 0
      };

      return {
        ...prev,
        [colorId]: {
          ...existing,
          quantity: (existing.quantity ?? 0) + 1
        }
      };
    });
  };

  const decreaseColorQty = (colorId: number) => {
    setAllocations(prev => {
      const existing = prev[colorId];
      if (!existing || (existing.quantity ?? 0) <= 0) return prev;

      return {
        ...prev,
        [colorId]: {
          ...existing,
          quantity: (existing.quantity ?? 0) - 1
        }
      };
    });
  };

  return {
    allocations,
    setAllocations,
    activeColorId,
    setActiveColorId,
    totalAllocatedQuantity,
    increaseColorQty,
    decreaseColorQty
  };
};