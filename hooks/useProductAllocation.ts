"use client"

import { useState } from "react";
import { AllocationState, FormValues } from "@/types/types";
import { SingleBale } from "@/types/baletype";

type Props = {
  baleData: SingleBale | undefined,
  buyDirectly: boolean,
  maxDirectAllowedQuantity: number,
  maxAllowedQuantity: number,
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>,
}

export const useProductAllocation = ({ 
  baleData, 
  buyDirectly,
  maxAllowedQuantity, 
  maxDirectAllowedQuantity,
  setFormValues
}: Props) => {
  const [allocations, setAllocations] = useState<AllocationState>({});
  const [activeColorId, setActiveColorId] = useState<number | null>(null);

  const hasSizes = baleData!?.product?.productSizes?.length > 0;
  const hasColors = baleData!?.product?.colors.length > 0
  const DEFAULT_COLOR_ID = 0

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

  const updateSizeQuantity = (
    colorId: number,
    sizeId: number,
    sizeLabel: string,
    quantity: number
  ) => {
    setAllocations(prev => {
      const existingColor = prev[colorId] ?? {
        colorId,
        colorLabel: baleData?.product.colors.find(c => c.id === colorId)?.color ?? "",
        colorImages: baleData?.product.colors.find(c => c.id === colorId)?.images ?? [],
        sizes: {},
        quantity: 0,
      }

      return {
        ...prev,
        [colorId]: {
          ...existingColor,
          sizes: {
            ...existingColor.sizes,
            [sizeId]: {
              sizeId,
              sizeLabel,
              quantity
            }
          }
        }
      }
    })
  }

  const updateColorQuantity = (
    colorId: number,
    quantity: number
  ) => {
    setAllocations(prev => {
      const existingColor = prev[colorId] ?? {
        colorId,
        colorLabel: baleData?.product.colors.find(c => c.id === colorId)?.color ?? "",
        colorImages: baleData?.product.colors.find(c => c.id === colorId)?.images ?? [],
        sizes: {},
        quantity: 0,
      }

      return {
        ...prev,
        [colorId]: {
          ...existingColor,
          quantity
        }
      }
    })
  }

  const increaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentTotal = totalAllocatedQuantity;
    if (buyDirectly) {
      if (currentTotal >= maxDirectAllowedQuantity) return;
    } else {
      if (currentTotal >= maxAllowedQuantity) return;
    }

    const currentQty =
      allocations[resolvedColorId]?.sizes?.[sizeId]?.quantity ?? 0;

    updateSizeQuantity(resolvedColorId, sizeId, sizeLabel, currentQty + 1);
  };

  const decreaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentQty =
      allocations[resolvedColorId]?.sizes?.[sizeId]?.quantity ?? 0;

    if (currentQty <= 0) return;

    updateSizeQuantity(resolvedColorId, sizeId, sizeLabel, currentQty - 1);
  };

  const increaseColorQty = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentTotal = totalAllocatedQuantity;
    if (buyDirectly) {
      if (currentTotal >= maxDirectAllowedQuantity) return;
    } else {
      if (currentTotal >= maxAllowedQuantity) return;
    }

    const currentQty = allocations[resolvedColorId]?.quantity ?? 0;

    updateColorQuantity(resolvedColorId, currentQty + 1);
  };

  const decreaseColorQty = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentQty = allocations[resolvedColorId]?.quantity ?? 0;

    if (currentQty <= 0) return;

    updateColorQuantity(resolvedColorId, currentQty - 1);
  };

  const getColorQuantity = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const allocation = allocations[resolvedColorId];
    if (!allocation) return 0;

    if (hasSizes) {
      return Object.values(allocation.sizes ?? {}).reduce(
        (sum, s) => sum + (s.quantity ?? 0),
        0
      );
    }

    return allocation.quantity ?? 0;
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target

    const color = baleData?.product.colors.find(c => c.color === value)
    if (!color) return

    setFormValues(prev => ({
      ...prev,
      colors: checked ? [value] : []
    }))

    if (checked) {
      setActiveColorId(color.id)

      setAllocations(prev => ({
        ...prev,
        [color.id]: prev[color.id] ?? {
          colorId: color.id,
          colorLabel: color.color,
          colorImages: color.images,
          sizes: {},
          quantity: 0,
        }
      }))
    } else {
      setActiveColorId(null)
    }
  }

  return {
    allocations,
    setAllocations,
    activeColorId,
    setActiveColorId,
    totalAllocatedQuantity,
    increaseColorQty,
    decreaseColorQty,
    increaseSizeQty,
    decreaseSizeQty,
    getColorQuantity,
    handleCheckboxChange,
    hasColors,
    hasSizes,
    DEFAULT_COLOR_ID
  };
};