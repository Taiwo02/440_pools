"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AnalyticsPayload,
  CartItemResponse,
  SingleCartItemPayload,
} from "@/types/types";
import {
  getCrossSubdomainCookie,
  getStoredBuyCart,
  setStoredBuyCart,
} from "@/lib/utils";
import { useAuth } from "./use-auth";
import { useSendAnalytics } from "@/api/analytics";
import {
  useAddCartItem,
  useClearCart,
  useGetCart,
  useRemoveCartItem,
} from "@/api/cart";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type BuyContextType = {
  buyCart: CartItemResponse[];
  hasSynced: boolean;
  addToBuyCart: (item: SingleCartItemPayload) => void;
  removeFromBuyCart: (productId: number) => void;
  clearBuyCart: () => void;
};

const BuyContext = createContext<BuyContextType | undefined>(undefined);

export const BuyProvider = ({ children }: { children: React.ReactNode }) => {
  const [buyCart, setBuyCart] = useState<CartItemResponse[]>(getStoredBuyCart);
  const [hasSynced, setHasSynced] = useState(false);
  const { data: serverCart } = useGetCart();
  const { mutateAsync: deleteItem } = useRemoveCartItem();
  const { mutateAsync: clearCart } = useClearCart();
  const { mutateAsync: addCartItem } = useAddCartItem();
  const { mutateAsync: sendAnalytics } = useSendAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    setStoredBuyCart(buyCart);
  }, [buyCart]);

  useEffect(() => {
    if (serverCart?.data?.items) {
      setBuyCart(serverCart.data.items);
      setStoredBuyCart(serverCart.data.items);
      setHasSynced(true);
    }
  }, [serverCart]);

  const addToBuyCart = useCallback(
    (item: SingleCartItemPayload) => {
      addCartItem(item)
        .then((res) => {
          const newItem: CartItemResponse = res.data.data;
          setBuyCart((prev) => {
            const existingIdx = prev.findIndex(
              (p) => p.product_id === newItem.product_id,
            );
            if (existingIdx === -1) {
              return [...prev, newItem];
            }
            const updated = [...prev];
            updated[existingIdx] = newItem;
            return updated;
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Could not add item to cart");
        });
    },
    [addCartItem],
  );

  const removeFromBuyCart = async (productId: number) => {
    const previousCart = buyCart;
    const target = buyCart.find((item) => item.product_id === productId);
    if (!target) return;

    const updatedCart = buyCart.filter((item) => item.product_id !== productId);
    setBuyCart(updatedCart);
    setStoredBuyCart(updatedCart);

    try {
      const res = await deleteItem(String(target.id));
      if (res.status === 200 || res.status === 201) {
        toast.success("Cart item deleted");
      }
    } catch (error) {
      setBuyCart(previousCart);
      setStoredBuyCart(previousCart);

      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Something went wrong, please try again",
        { position: "top-right", autoClose: 2000 },
      );
    }
  };

  const clearBuyCart = async () => {
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
      sendAnalytics(payload).catch((err) => console.log(err));
    }

    const previousCart = buyCart;
    setBuyCart([]);
    setStoredBuyCart([]);

    try {
      const res = await clearCart();
      if (res.status === 200 || res.status === 201) {
        toast.success("Cart cleared");
      }
    } catch (error) {
      setBuyCart(previousCart);
      setStoredBuyCart(previousCart);

      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Something went wrong, please try again",
        { position: "top-right", autoClose: 2000 },
      );
    }
  };

  return (
    <BuyContext.Provider
      value={{
        buyCart,
        hasSynced,
        addToBuyCart,
        removeFromBuyCart,
        clearBuyCart,
      }}
    >
      {children}
    </BuyContext.Provider>
  );
};

export const useBuy = () => useContext(BuyContext)!;