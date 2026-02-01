import { CartItem } from "@/types/types";

export const setCrossSubdomainCookie = (
  name: string,
  value: string,
  days?: number
): void => {
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
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const found = cookies.find((c) => c.startsWith(nameEQ));
  return found ? decodeURIComponent(found.substring(nameEQ.length)) : null;
};

export const deleteCrossSubdomainCookie = (name: string): void => {
  setCrossSubdomainCookie(name, "", -1);
};

const CART_KEY = "cart";

export const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

export const setStoredCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};