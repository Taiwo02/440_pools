import {
  CartItem,
  CartItemResponse,
  CartObject,
  SingleCartItemPayload,
} from "@/types/types";

export const setCrossSubdomainCookie = (
  name: string,
  value: string,
  days?: number,
): void => {
  if (typeof window === "undefined") return;
  const expires = days
    ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
    : "";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const sameSite = secure ? "; SameSite=None" : "";
  const hostname = window.location.hostname;
  const domain =
    hostname !== "localhost" && hostname !== "127.0.0.1"
      ? `; domain=.${hostname.replace(/^www\./, "")}`
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/${sameSite}${secure}${domain}`;
};

export const getCrossSubdomainCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const found = cookies.find((c) => c.startsWith(nameEQ));
  return found ? decodeURIComponent(found.substring(nameEQ.length)) : null;
};

export const deleteCrossSubdomainCookie = (name: string): void => {
  if (typeof window === "undefined") return;
  setCrossSubdomainCookie(name, "", -1);
};

// For joining slot
const CART_KEY = "cart";

export const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

export const setStoredCart = (cart: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// For buying directly from supplier
const BUY_KEY = "buy_cart_v2";

export const getStoredBuyCart = (): CartItemResponse[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setStoredBuyCart = (buy: CartItemResponse[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BUY_KEY, JSON.stringify(buy));
};

// For guest cart
const GUEST_PHONE_KEY = "guest_phone_number";

export const getStoredPhone = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_PHONE_KEY);
};

export const setStoredPhone = (phone: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_PHONE_KEY, phone);
};