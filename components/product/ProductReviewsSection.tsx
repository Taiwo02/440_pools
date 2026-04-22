"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine, RiStarFill, RiStarLine, RiUser3Line } from "react-icons/ri";
import type { ProductReview } from "@/types/baletype";

type Props = {
  reviews?: ProductReview[] | null;
};

function parseRating(r: string): number {
  const n = parseFloat(r);
  return Number.isFinite(n) ? Math.min(5, Math.max(0, n)) : 0;
}

function reviewStats(reviews: ProductReview[]) {
  if (reviews.length === 0) return { avg: 0, positivePct: 0 };
  const nums = reviews.map((x) => parseRating(x.rating));
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const positive = nums.filter((n) => n >= 4).length;
  const positivePct = (positive / nums.length) * 100;
  return { avg, positivePct };
}

function StarsRow({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.min(5, Math.max(0, Math.round(value)));
  const empty = 5 - full;
  return (
    <div className="flex items-center gap-0.5 shrink-0" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <RiStarFill key={`f-${i}`} size={size} className="text-(--primary)" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <RiStarLine key={`e-${i}`} size={size} className="text-(--primary)/35" />
      ))}
    </div>
  );
}

function ReviewEntry({ review }: { review: ProductReview }) {
  const initial = review.buyerName?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <article className="py-5 border-b border-(--border-default) last:border-b-0 last:pb-0">
      <div className="flex gap-3">
        <div
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-muted) text-(--text-muted)"
          aria-hidden
        >
          {initial && initial !== "?" ? (
            <span className="text-sm font-semibold text-(--text-secondary)">{initial}</span>
          ) : (
            <RiUser3Line size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="rounded-sm bg-black px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white dark:bg-neutral-200 dark:text-neutral-900">
              PLUS
            </span>
            <span className="font-medium text-(--text-muted)">{review.buyerName}</span>
            <span className="text-(--border-muted) select-none">|</span>
          </div>
          <p className="mt-1 text-xs text-(--text-muted) whitespace-pre-line leading-relaxed">
            {review.purchasedItem}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-(--text-primary)">{review.note}</p>
          {review.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.images.map((src, i) => (
                <img
                  key={`${review.id}-${i}`}
                  src={src}
                  alt=""
                  className="h-16 w-16 rounded-md border border-(--border-default) object-cover bg-(--bg-muted)"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductReviewsSection({ reviews: rawReviews }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  /** Chronological (oldest → newest), like a Telegram thread */
  const sorted = useMemo(() => {
    const list = rawReviews ?? [];
    return [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [rawReviews]);

  const { avg, positivePct } = useMemo(() => reviewStats(sorted), [sorted]);
  const preview = sorted.slice(-3);
  const hasMore = sorted.length > 3;

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  if (sorted.length === 0) {
    return (
      <div className="text-sm text-(--text-muted) py-2 mb-8">
        <h3 className="text-lg font-bold text-(--text-primary)">
          Product Reviews
        </h3>
        No reviews yet. Be the first to share feedback after purchase.
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 mb-2">
          <h3 className="text-lg font-bold text-(--text-primary)">Product Reviews</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <StarsRow value={avg} size={16} />
            <span className="font-semibold text-(--primary) tabular-nums">{avg.toFixed(1)}</span>
            <span className="text-(--border-muted) select-none" aria-hidden>
              |
            </span>
            <span className="text-(--text-muted)">Positive rating</span>
            <span className="font-semibold text-(--primary) tabular-nums">
              {positivePct.toFixed(1)} %
            </span>
          </div>
        </div>

        <div className="mt-2">
          {preview.map((review) => (
            <ReviewEntry key={review.id} review={review} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-md border border-(--border-default) bg-(--bg-surface) px-4 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--bg-muted) transition-colors"
            >
              View all reviews
            </button>
          </div>
        )}
      </div>

      {modalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9998 flex min-h-dvh w-full items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-reviews-modal-title"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col rounded-t-2xl bg-(--bg-surface) shadow-2xl sm:rounded-2xl sm:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-(--border-default) px-4 py-3 shrink-0">
                <h4
                  id="product-reviews-modal-title"
                  className="text-base font-bold text-(--text-primary)"
                >
                  All reviews ({sorted.length})
                </h4>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-(--text-muted) hover:bg-(--bg-muted) hover:text-(--text-primary)"
                  aria-label="Close"
                >
                  <RiCloseLine size={22} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-6">
                {sorted.map((review) => (
                  <ReviewEntry key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
