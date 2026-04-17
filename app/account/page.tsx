"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("section");
    if (s === "orders") {
      router.replace("/account/orders/ongoing");
      return;
    }
    if (s === "deliveries") {
      router.replace("/account/deliveries");
      return;
    }
    router.replace("/account/overview");
  }, [searchParams, router]);

  return null;
}

export default function AccountHubPage() {
  return (
    <Suspense fallback={null}>
      <Redirect />
    </Suspense>
  );
}
