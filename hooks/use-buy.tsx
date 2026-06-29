"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnalyticsPayload, CartItem } from "@/types/types";
import { getCrossSubdomainCookie, getStoredBuyCart, setStoredBuyCart } from "@/lib/utils";
import { useAuth } from "./use-auth";
import { useSendAnalytics } from "@/api/analytics";

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
  const {
    mutateAsync: sendAnalytics,
    isPending: isAnalyticsPending,
    error: analyticsError,
  } = useSendAnalytics();

  const { user } = useAuth();
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

  const clearBuyCart = () => {
    if (user) {
      const session_id = getCrossSubdomainCookie("440_session_id");
      const payload: AnalyticsPayload = {
        event_id: crypto.randomUUID(),
        event_name: "CART_CLEARED",
        session_id: session_id!,
        source: "web",
        resource_type: "cart",
        properties: {},
        platform: "web",
        occurred_at: new Date().toISOString(),
      };

      const analytics = async () => {
        try {
          const res = await sendAnalytics(payload);
          if (res.status === 200) {
            console.log("Product viewed");
          }
        } catch (error) {
          console.log(error);
        }
      };

      analytics();
    }

    setBuyCart([]);
  };

  return (
    <BuyContext.Provider
      value={{ buyCart, addToBuyCart, removeFromBuyCart, updateBuyQuantity, clearBuyCart }}
    >
      {children}
    </BuyContext.Provider>
  );
};

export const useBuy = () => useContext(BuyContext)!;