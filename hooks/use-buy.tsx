"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/types";
import { getStoredBuyCart, setStoredBuyCart } from "@/lib/utils";

type BuyContextType = {
  buyCart: CartItem[];
  addToBuyCart: (item: CartItem) => void;
  removeFromBuyCart: (id: string) => void;
  updateBuyQuantity: (id: string, quantity: number) => void;
  clearBuyCart: () => void;
};

const BuyContext = createContext<BuyContextType | undefined>(undefined);

export const BuyProvider = ({ children }: { children: React.ReactNode }) => {
  const [buyCart, setBuyCart] = useState<CartItem[]>([]);
  useEffect(() => {
    setBuyCart(getStoredBuyCart());
  }, []);

  // Sync to localStorage EVERY TIME cart changes
  useEffect(() => {
    setStoredBuyCart(buyCart);
  }, [buyCart]);

  const normalizeVariants = (variants: Record<string, any>) => {
    return Object.keys(variants)
      .sort()
      .reduce((acc, key) => {
        let value = variants[key];

        // parse stringified arrays
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            value = parsed;
          } catch { }
        }

        // sort arrays for consistency
        if (Array.isArray(value)) {
          value = [...value].sort();
        }

        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);
  };

  const isSameVariant = (
    a: Record<string, any>,
    b: Record<string, any>
  ) => {
    return (
      JSON.stringify(normalizeVariants(a)) ===
      JSON.stringify(normalizeVariants(b))
    );
  };

  const addToBuyCart = (item: CartItem) => {
    setBuyCart(prev => {
      const normalizedItem = {
        ...item,
        variants: normalizeVariants(item.variants),
      };

      const existing = prev.find(
        p =>
          p.productId === normalizedItem.productId &&
          isSameVariant(p.variants, normalizedItem.variants)
      );

      if (existing) {
        return prev.map(p =>
          p.cartItemId === existing.cartItemId
            ? { ...p, slots: p.slots + normalizedItem.slots }
            : p
        );
      }

      return [...prev, normalizedItem];
    });
  };


  const removeFromBuyCart = (id: string) => {
    setBuyCart(prev => prev.filter(item => item.cartItemId !== id));
  };

  const updateBuyQuantity = (id: string, slots: number) => {
    setBuyCart(prev =>
      prev.map(item =>
        item.cartItemId === id
          ? { ...item, slots }
          : item
      )
    );
  };

  const clearBuyCart = () => setBuyCart([]);

  return (
    <BuyContext.Provider
      value={{ buyCart, addToBuyCart, removeFromBuyCart, updateBuyQuantity, clearBuyCart }}
    >
      {children}
    </BuyContext.Provider>
  );
};

export const useBuy = () => useContext(BuyContext)!;