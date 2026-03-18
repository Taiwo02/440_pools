"use client";

import { useState } from "react";
import { cn } from "@/components/ui/utils";

function firstImageUrl(images?: string[] | null): string | null {
  const u = images?.[0];
  if (typeof u !== "string") return null;
  const t = u.trim();
  return t.length > 0 ? t : null;
}

/** Short label when there is no image (or it failed to load). */
export function shortProductPreview(name: string, maxChars = 40): string {
  const s = name.trim().replace(/\s+/g, " ");
  if (s.length <= maxChars) return s;
  return `${s.slice(0, Math.max(1, maxChars - 1))}…`;
}

type Props = {
  images?: string[] | null;
  productName: string;
  className?: string;
  imgClassName?: string;
  previewMaxChars?: number;
};

/**
 * Shows product image, or a compact text preview of the name when missing / broken.
 */
export default function ProductThumbPlaceholder({
  images,
  productName,
  className,
  imgClassName,
  previewMaxChars = 40,
}: Props) {
  const url = firstImageUrl(images);
  const [failed, setFailed] = useState(false);
  const showText = !url || failed;
  const preview = shortProductPreview(productName, previewMaxChars);

  if (showText) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 text-center",
          className
        )}
      >
        <p
          className="text-[11px] leading-snug text-gray-600 line-clamp-3 px-2 font-medium wrap-break-word hyphens-auto"
          title={productName}
        >
          {preview}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={url}
        alt=""
        className={cn("w-full h-full object-cover", imgClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
