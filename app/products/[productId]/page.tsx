import ProductDetailsClient from "./ProductDetailsClient";

/**
 * Static export: every bale id here becomes `out/products/<id>/index.html`.
 * Set NEXT_PUBLIC_BASE_URL (or API_ORIGIN) at **build time** on CI/cPanel so this list is complete.
 * Missing ids → no HTML file → on some hosts the URL changes but the home shell keeps showing.
 */
export async function generateStaticParams() {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    process.env.API_ORIGIN?.replace(/\/$/, "") ||
    "";

  if (!baseURL) {
    console.warn(
      "[generateStaticParams] NEXT_PUBLIC_BASE_URL (or API_ORIGIN) is unset; no product pages will be pre-rendered."
    );
    return [];
  }

  try {
    const res = await fetch(`${baseURL}/buyer/bales`, { cache: "no-store" });
    if (!res.ok) {
      console.warn("[generateStaticParams] /buyer/bales failed:", res.status);
      return [];
    }
    const data = await res.json();
    const bales = data?.data ?? [];
    return bales.map((b: { id: number }) => ({ productId: String(b.id) }));
  } catch (e) {
    console.warn("[generateStaticParams] fetch error:", e);
    return [];
  }
}

// export async function generateStaticParams() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/bales`
//     );

//     const data = await res.json();
//     const bales = data?.data ?? [];

//     if (!bales.length) {
//       console.warn("No bales found for static generation");
//     }

//     return bales.map((b: { id: number }) => ({
//       productId: String(b.id),
//     }));
//   } catch (err) {
//     console.error("Failed to generate static params:", err);
//     return [];
//   }
// }

export default function ProductPage() {
  return <ProductDetailsClient />;
}
