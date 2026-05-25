export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * PageView tracking
 */
export const pageview = () => {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "PageView");
};

/**
 * Standard Meta Pixel events
 */
export type StandardEvent =
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Search"
  | "AddToWishlist"
  | "Contact";

/**
 * Event tracker (supports both standard + custom events)
 */
export const event = (
  name: StandardEvent | (string & {}),
  options: Record<string, any> = {},
  isCustom: boolean = false,
) => {
  if (typeof window === "undefined" || !window.fbq) return;

  if (isCustom) {
    window.fbq("trackCustom", name, options);
  } else {
    window.fbq("track", name, options);
  }
};