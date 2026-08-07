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
  CartItem,
  CartItemResponse,
  SingleCartItemPayload,
} from "@/types/types";
import {
  getCrossSubdomainCookie,
  getStoredBuyCart,
  setStoredBuyCart,
  getStoredPhone,
  setStoredPhone,
} from "@/lib/utils";
import { useAuth } from "./use-auth";
import { useSendAnalytics } from "@/api/analytics";
import {
  useAddCartItem,
  useAddPublicCartItem,
  useClearCart,
  useClearPublicCart,
  useGetCart,
  useGetPublicCart,
  useRemoveCartItem,
  useRemovePublicCartItem,
  useUpdateCartItem,
  useUpdatePublicCartItem,
} from "@/api/cart";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type BuyContextType = {
  buyCart: CartItemResponse[];
  hasSynced: boolean;
  guestPhone: string;
  addToBuyCart: (item: SingleCartItemPayload) => void;
  removeFromBuyCart: (productId: number) => void;
  clearBuyCart: () => void;
};

const BuyContext = createContext<BuyContextType | undefined>(undefined);

export const BuyProvider = ({ children }: { children: React.ReactNode }) => {
  const [buyCart, setBuyCart] = useState<CartItemResponse[]>(getStoredBuyCart);
  const [hasSynced, setHasSynced] = useState(false);
  // mirrors localStorage phone so public-cart hooks (which take
  // `phone` as a hook param, not a mutate-time arg) stay in sync
  const [guestPhone, setGuestPhone] = useState<string>(
    () => getStoredPhone() ?? "",
  );

  const token = getCrossSubdomainCookie("440_token");

  const { data: serverCart } = useGetCart({ enabled: !!token });
  const { data: publicServerCart } = useGetPublicCart(
    { phone: guestPhone },
    { enabled: !token && !!guestPhone },
  );

  const { mutateAsync: deleteItem } = useRemoveCartItem();
  const { mutateAsync: deletePublicItem } = useRemovePublicCartItem({
    phone: guestPhone,
  });
  const { mutateAsync: clearCart } = useClearCart();
  const { mutateAsync: clearPublicCart } = useClearPublicCart({
    phone: guestPhone,
  });
  const { mutateAsync: addCartItem } = useAddCartItem();
  const { mutateAsync: addPublicCartItem } = useAddPublicCartItem();
  const { mutateAsync: sendAnalytics } = useSendAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    setStoredBuyCart(buyCart);
  }, [buyCart]);

  // hydrate from the authenticated server cart
  useEffect(() => {
    if (token && serverCart?.data?.items) {
      setBuyCart(serverCart.data.items);
      setStoredBuyCart(serverCart.data.items);
      setHasSynced(true);
    }
  }, [serverCart, token]);

  // hydrate from the guest/public server cart once we know their phone
  useEffect(() => {
    if (!token && publicServerCart?.data?.items) {
      setBuyCart(publicServerCart.data.items);
      setStoredBuyCart(publicServerCart.data.items);
      setHasSynced(true);
    }
  }, [publicServerCart, token]);

  const rememberPhone = useCallback((phone: string) => {
    setStoredPhone(phone);
    setGuestPhone(phone);
  }, []);

  const addToBuyCart = useCallback(
    (item: SingleCartItemPayload) => {
      const token = getCrossSubdomainCookie("440_token");
      const mutation = token ? addCartItem : addPublicCartItem;

      let payload = item;

      if (!token) {
        // fall back to whatever phone number we've already got on file
        // for this guest, so callers don't have to keep re-passing it
        const phone = item.phone || guestPhone || getStoredPhone();

        if (!phone) {
          toast.error("Phone number required to add item to cart");
          return;
        }

        rememberPhone(phone);
        payload = { ...item, phone };
      }

      mutation(payload)
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
    [addCartItem, addPublicCartItem, guestPhone, rememberPhone],
  );

  const removeFromBuyCart = async (productId: number) => {
    const token = getCrossSubdomainCookie("440_token");
    const previousCart = buyCart;
    const target = buyCart.find((item) => item.product_id === productId);
    if (!target) return;

    if (!token && !guestPhone) {
      toast.error("Phone number required to remove item from cart");
      return;
    }

    const updatedCart = buyCart.filter((item) => item.product_id !== productId);
    setBuyCart(updatedCart);
    setStoredBuyCart(updatedCart);

    try {
      const res = token
        ? await deleteItem(String(target.id))
        : await deletePublicItem(String(target.id));

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
    const token = getCrossSubdomainCookie("440_token");

    if (!token && !guestPhone) {
      toast.error("Phone number required to clear cart");
      return;
    }

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
      const res = token ? await clearCart() : await clearPublicCart();

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
        guestPhone,
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