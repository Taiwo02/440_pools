"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as fbq from "@/lib/fpixel";

export default function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbq.pageview();
  }, [pathname, searchParams]);

  return null;
}