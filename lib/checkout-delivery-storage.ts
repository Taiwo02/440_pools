const CHECKOUT_DELIVERY_ID_KEY = "440_checkout_delivery_id";

export function getStoredCheckoutDeliveryId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CHECKOUT_DELIVERY_ID_KEY);
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function setStoredCheckoutDeliveryId(id: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_DELIVERY_ID_KEY, String(id));
}
