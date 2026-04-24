const STORAGE_KEY = "440_recently_viewed_bales";
const MAX_ITEMS = 16;

export type RecentlyViewedBale = {
  baleId: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  viewedAt: number;
};

function readRaw(): RecentlyViewedBale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RecentlyViewedBale =>
        x != null &&
        typeof x === "object" &&
        typeof (x as RecentlyViewedBale).baleId === "string" &&
        typeof (x as RecentlyViewedBale).name === "string"
    );
  } catch {
    return [];
  }
}

function write(entries: RecentlyViewedBale[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota / private mode */
  }
}

/** Call when a product (bale) page is shown with loaded bale data. */
export function recordRecentlyViewedBale(bale: {
  id: number | string;
  price: number;
  oldPrice?: number | null;
  product: { name: string; images?: string[] | null };
}): void {
  if (typeof window === "undefined") return;
  const oldPrice =
    typeof bale.oldPrice === "number" && bale.oldPrice > 0
      ? bale.oldPrice
      : bale.price;
  const entry: RecentlyViewedBale = {
    baleId: String(bale.id),
    name: bale.product.name,
    image: bale.product.images?.[0] ?? "",
    price: bale.price,
    oldPrice,
    viewedAt: Date.now(),
  };

  const prev = readRaw().filter((e) => e.baleId !== entry.baleId);
  write([entry, ...prev].slice(0, MAX_ITEMS));
  window.dispatchEvent(new Event("440-recently-viewed-updated"));
}

export function getRecentlyViewedBales(): RecentlyViewedBale[] {
  return readRaw()
    .filter((e) => e.baleId && e.name)
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .slice(0, MAX_ITEMS);
}
