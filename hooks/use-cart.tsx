"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/types";
import { getStoredCart, setStoredCart } from "@/lib/utils";

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    setCart(getStoredCart());
  }, []);

  // Sync to localStorage EVERY TIME cart changes
  useEffect(() => {
    setStoredCart(cart);
  }, [cart]);

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

  const addToCart = (item: CartItem) => {
    setCart(prev => {
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


  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== id));
  };

  const updateQuantity = (id: string, slots: number) => {
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === id
          ? { ...item, slots }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;