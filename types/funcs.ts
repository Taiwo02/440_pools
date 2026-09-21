import { toast } from "react-toastify";

export const formatNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }

  return value.toString();
};

export const openPaystackPopup = async (
  accessCode: string,
  onSuccess: (transaction: { reference: string }) => void,
  onCancel: () => void
) => {
  //@ts-ignore
  const PaystackPop = (await import("@paystack/inline-js")).default;

  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    accessCode,
    onSuccess,
    onCancel
  });
};

export const showToast = (
  type: "success" | "error" | "warning" | "info",
  message: string,
) => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "info") toast.info(message);
  else toast.warning(message);
};

export const isObjectComplete = (
  obj: Record<string, unknown>,
  excludeKeys: string[] = [],
): boolean => {
  return Object.entries(obj).every(([key, value]) => {
    if (excludeKeys.includes(key)) return true;

    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.trim() !== "";
    return value !== null && value !== undefined;
  });
};