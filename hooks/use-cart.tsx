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

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.productId === item.productId);

      if (existing) {
        return prev.map(p =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
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