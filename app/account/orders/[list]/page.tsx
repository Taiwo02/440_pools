import { notFound } from "next/navigation";
import OrdersListClient from "./OrdersListClient";
import type { OrdersListKind } from "@/components/account/OrderHistory";

const VALID = ["ongoing", "canceled", "locked"] as const satisfies readonly OrdersListKind[];

export function generateStaticParams() {
  return VALID.map((list) => ({ list }));
}

export default async function AccountOrdersListPage({
  params,
}: {
  params: Promise<{ list: string }>;
}) {
  const { list } = await params;
  if (!(VALID as readonly string[]).includes(list)) notFound();

  return <OrdersListClient list={list as OrdersListKind} />;
}
