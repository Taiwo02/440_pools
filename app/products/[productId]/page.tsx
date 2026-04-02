import ProductDetailsClient from "./ProductDetailsClient";

export async function generateStaticParams() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseURL) return [];
  try {
    const res = await fetch(`${baseURL}/buyer/bales`);
    const data = await res.json();
    const bales = data?.data ?? [];
    return bales.map((b: { id: number }) => ({ productId: String(b.id) }));
  } catch {
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
