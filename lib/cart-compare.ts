import { SingleCartItemPayload } from "@/types/types";

export const isSameCartItem = (
  a: SingleCartItemPayload,
  b: SingleCartItemPayload,
): boolean => {
  if (a.productId !== b.productId) return false;
  if (a.quantity !== b.quantity) return false;

  const aColors = a.colorSelections ?? [];
  const bColors = b.colorSelections ?? [];
  if (aColors.length !== bColors.length) return false;

  const sortedA = [...aColors].sort((x, y) => x.colorId - y.colorId);
  const sortedB = [...bColors].sort((x, y) => x.colorId - y.colorId);

  for (let i = 0; i < sortedA.length; i++) {
    const ca = sortedA[i];
    const cb = sortedB[i];
    if (ca.colorId !== cb.colorId) return false;
    if (ca.quantity !== cb.quantity) return false;
    if (ca.sizes.length !== cb.sizes.length) return false;

    const sizesA = [...ca.sizes].sort((x, y) => x.sizeId - y.sizeId);
    const sizesB = [...cb.sizes].sort((x, y) => x.sizeId - y.sizeId);

    for (let j = 0; j < sizesA.length; j++) {
      if (
        sizesA[j].sizeId !== sizesB[j].sizeId ||
        sizesA[j].quantity !== sizesB[j].quantity
      ) {
        return false;
      }
    }
  }

  return true;
};