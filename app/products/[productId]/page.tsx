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

export default function ProductPage() {
  return <ProductDetailsClient />;
}
