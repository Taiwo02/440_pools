import type { InitiatePayment } from "@/types/checkout";

/**
 * Where the backend should send the shopper after payment (hosted verify / deep link).
 * Override with NEXT_PUBLIC_PAYMENT_RETURN_URL when it must differ from origin/verify.
 */
export function getPaymentReturnUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL?.trim();
  if (explicit) return explicit;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, "")}/verify`;
  }
  return "https://shop.4401.live/verify";
}

function asRecord(v: unknown): Record<string, unknown> | undefined {
  if (!v || typeof v !== "object") return undefined;
  return v as Record<string, unknown>;
}

function parsePositiveInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
  return undefined;
}

/**
 * POST /buyer/checkout-intent — supports nested checkout and legacy flat id.
 */
export function parseCheckoutIntentCheckoutId(apiBody: unknown): number | undefined {
  const root = asRecord(apiBody);
  const data = asRecord(root?.data);
  if (!data) return undefined;
  const checkout = asRecord(data.checkout);
  const fromCheckout = checkout ? parsePositiveInt(checkout.id) : undefined;
  if (fromCheckout != null) return fromCheckout;
  return parsePositiveInt(data.id);
}

/**
 * POST /buyer/direct-order — first created order id for UPFRONT / installment flows.
 */
export function parseDirectOrderOrderId(apiBody: unknown): number | undefined {
  const root = asRecord(apiBody);
  const data = asRecord(root?.data);
  if (!data) return undefined;
  const orders = data.orders;
  if (!Array.isArray(orders) || orders.length === 0) return undefined;
  return parsePositiveInt(asRecord(orders[0])?.id);
}

export function buildBaleLockInitiateBody(
  checkoutId: number,
  paymentType: "WALLET" | "CARD" = "CARD",
  pin?: string
): InitiatePayment {
  return {
    flowType: "BALE",
    action: "LOCK",
    paymentType,
    ...(pin ? { pin } : {}),
    checkoutId,
    returnUrl: getPaymentReturnUrl(),
  };
}

/** Pay remaining balance after a slot lock (same checkout). */
export function buildBaleFullInitiateBody(
  checkoutId: number,
  paymentType: "WALLET" | "CARD" = "CARD",
  pin?: string
): InitiatePayment {
  return {
    flowType: "BALE",
    action: "FULL",
    paymentType,
    ...(pin ? { pin } : {}),
    checkoutId,
    returnUrl: getPaymentReturnUrl(),
  };
}

export function buildDirectUpfrontInitiateBody(
  orderId: number,
  paymentType: "WALLET" | "CARD" = "CARD",
  pin?: string
): InitiatePayment {
  return {
    flowType: "DIRECT",
    action: "UPFRONT",
    paymentType,
    ...(pin ? { pin } : {}),
    orderId,
    returnUrl: getPaymentReturnUrl(),
  };
}

export function buildDirectInstallmentEntryBody(
  orderId: number,
  paymentType: "WALLET" | "CARD" = "CARD",
  pin?: string
): InitiatePayment {
  return {
    flowType: "DIRECT",
    action: "INSTALLMENT_ENTRY",
    paymentType,
    ...(pin ? { pin } : {}),
    orderId,
    returnUrl: getPaymentReturnUrl(),
  };
}
