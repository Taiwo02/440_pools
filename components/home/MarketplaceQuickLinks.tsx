"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import type { IconType } from "react-icons";
import {
  RiApps2Line,
  RiBuilding2Line,
  RiBuilding4Line,
  RiStore2Line,
  RiFileList3Line,
} from "react-icons/ri";

export function showComingSoon() {
  toast.info("Coming soon...");
}

type QuickItem =
  | {
      kind: "link";
      href: string;
      label: string;
      subtitle: string;
      titleClass: string;
      desktopIconClass: string;
      icon: IconType;
      circle: string;
    }
  | {
      kind: "rfq";
      label: string;
      subtitle: string;
      titleClass: string;
      desktopIconClass: string;
      icon: IconType;
      circle: string;
    }
  | {
      kind: "soon";
      label: string;
      subtitle: string;
      titleClass: string;
      desktopIconClass: string;
      icon: IconType;
      circle: string;
    };

const MARKETPLACE_QUICK_ITEMS: QuickItem[] = [
  {
    kind: "soon",
    label: "Suppliers",
    subtitle: "Vetted B2B partners & wholesalers",
    titleClass: "text-sky-600",
    desktopIconClass: "bg-sky-50 text-sky-700",
    icon: RiBuilding2Line,
    circle: "bg-slate-100 text-slate-700",
  },
  {
    kind: "soon",
    label: "Factories",
    subtitle: "Direct from plants & production lines",
    titleClass: "text-violet-600",
    desktopIconClass: "bg-violet-50 text-violet-700",
    icon: RiBuilding4Line,
    circle: "bg-amber-100 text-amber-800",
  },
  {
    kind: "soon",
    label: "Markets",
    subtitle: "Regional hubs, markets & spot deals",
    titleClass: "text-amber-800",
    desktopIconClass: "bg-amber-50 text-amber-900",
    icon: RiStore2Line,
    circle: "bg-(--primary) text-white",
  },
  {
    kind: "rfq",
    label: "RFQ",
    subtitle: "Request quotes for any product",
    titleClass: "text-red-600",
    desktopIconClass: "bg-red-50 text-red-700",
    icon: RiFileList3Line,
    circle: "bg-sky-100 text-sky-800",
  },
  {
    kind: "link",
    href: "/products",
    label: "All pools",
    subtitle: "Every open group buy in one place",
    titleClass: "text-orange-600",
    desktopIconClass: "bg-orange-50 text-orange-700",
    icon: RiApps2Line,
    circle: "bg-(--primary-soft) text-(--primary)",
  },
];

type Props = {
  variant: "mobile" | "desktop";
  onRequestQuote?: () => void;
};

const mobileActionClass =
  "flex flex-col items-center gap-2 min-w-[4.5rem] max-w-[5.75rem] shrink-0 text-center cursor-pointer rounded-lg border-none bg-(--bg-page) px-3 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2";

const mobileLinkClass =
  "flex flex-col items-center gap-2 min-w-[4.5rem] max-w-[5.75rem] shrink-0 text-center px-3 py-0.5 bg-(--bg-page)";

const desktopCellClass =
  "flex flex-1 min-w-0 items-center justify-between gap-3 pl-4 pr-3.5 py-3 text-left transition-colors bg-(--bg-surface) hover:bg-(--bg-muted)/70";

const desktopIconBox =
  "shrink-0 flex h-12 w-12 items-center justify-center rounded-lg shadow-sm";

export default function MarketplaceQuickLinks({
  variant,
  onRequestQuote,
}: Props) {
  const isMobile = variant === "mobile";

  const iconWrapClass =
    "flex h-14 w-14 items-center justify-center rounded-full shadow-sm";

  const renderIcon = (item: QuickItem) => {
    const Icon = item.icon;
    return (
      <span className={`${iconWrapClass} ${item.circle}`}>
        <Icon className="text-2xl" aria-hidden />
      </span>
    );
  };

  const renderDesktopIcon = (item: QuickItem) => {
    const Icon = item.icon;
    return (
      <span className={`${desktopIconBox} ${item.desktopIconClass}`}>
        <Icon className="text-xl" aria-hidden />
      </span>
    );
  };

  const renderMobileLabel = (item: QuickItem) => (
    <span className="flex flex-col items-center gap-0.5 w-full min-w-0">
      <span className="text-[11px] font-semibold text-(--text-primary) text-center leading-snug">
        {item.label}
      </span>
      <span className="text-[9px] font-medium text-(--text-muted) text-center leading-tight line-clamp-2">
        {item.subtitle}
      </span>
    </span>
  );

  const renderDesktopInner = (item: QuickItem) => (
    <>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold leading-snug truncate ${item.titleClass}`}
        >
          {item.label}
        </p>
        <p className="text-xs text-(--text-muted) leading-snug line-clamp-2 mt-1">
          {item.subtitle}
        </p>
      </div>
      {renderDesktopIcon(item)}
    </>
  );

  const inner = MARKETPLACE_QUICK_ITEMS.map((item) => {
    if (item.kind === "rfq") {
      return (
        <button
          key={item.label}
          type="button"
          aria-label="Request for quotation"
          onClick={() => onRequestQuote?.()}
          className={
            isMobile
              ? mobileActionClass
              : `${desktopCellClass} cursor-pointer`
          }
        >
          {isMobile ? (
            <>
              {renderIcon(item)}
              {renderMobileLabel(item)}
            </>
          ) : (
            renderDesktopInner(item)
          )}
        </button>
      );
    }

    if (item.kind === "soon") {
      return (
        <button
          key={item.label}
          type="button"
          aria-label={`${item.label} — coming soon`}
          onClick={showComingSoon}
          className={
            isMobile
              ? mobileActionClass
              : `${desktopCellClass} cursor-pointer`
          }
        >
          {isMobile ? (
            <>
              {renderIcon(item)}
              {renderMobileLabel(item)}
            </>
          ) : (
            renderDesktopInner(item)
          )}
        </button>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={isMobile ? mobileLinkClass : desktopCellClass}
      >
        {isMobile ? (
          <>
            {renderIcon(item)}
            {renderMobileLabel(item)}
          </>
        ) : (
          renderDesktopInner(item)
        )}
      </Link>
    );
  });

  if (isMobile) {
    return (
      <div className="px-3 pt-2 pb-4">
        <div className="flex justify-between gap-px overflow-x-auto no-scrollbar rounded-md bg-neutral-100 p-px">
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex min-h-[4.75rem] gap-px rounded-lg overflow-hidden border border-neutral-100 bg-neutral-100 p-px shadow-md">
      {inner}
    </div>
  );
}
