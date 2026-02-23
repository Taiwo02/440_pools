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