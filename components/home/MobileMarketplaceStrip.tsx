"use client";

import MarketplaceQuickLinks from "./MarketplaceQuickLinks";

type Props = {
  onRequestQuote?: () => void;
};

export default function MobileMarketplaceStrip({ onRequestQuote }: Props) {
  return (
    <div className="md:hidden bg-(--bg-page)">
      <div className="pt-24 md:pt-29">
        <MarketplaceQuickLinks variant="mobile" onRequestQuote={onRequestQuote} />
      </div>
    </div>
  );
}
