"use client";

import { useGetWalletBalance } from "@/api/wallet";
import { RiEyeLine, RiEyeOffLine, RiLoader4Line, RiWallet3Line } from "react-icons/ri";
import { useState } from "react";

interface WalletBalanceProps {
  merchantId: number | string | undefined;
  /** Visual variant — "row" (default) for compact inline use, "card" for a bordered card */
  variant?: "row" | "card";
  className?: string;
}

export default function WalletBalance({
  merchantId,
  variant = "row",
  className = "",
}: WalletBalanceProps) {
  const [visible, setVisible] = useState(false);
  const { data: wallet, isPending } = useGetWalletBalance(merchantId);

  const formattedBalance =
    wallet?.wallet_balance != null
      ? wallet.wallet_balance.toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  const balanceNode = isPending ? (
    <span className="flex items-center gap-1 text-gray-400">
      <RiLoader4Line className="animate-spin text-base" />
      <span>Loading…</span>
    </span>
  ) : (
    <span className="flex items-center gap-2">
      <span className="font-semibold">
        {visible
          ? formattedBalance != null
            ? `₦ ${formattedBalance}`
            : "₦ —"
          : "₦ ••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide balance" : "Show balance"}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        {visible ? (
          <RiEyeOffLine className="text-base" />
        ) : (
          <RiEyeLine className="text-base" />
        )}
      </button>
    </span>
  );

  if (variant === "card") {
    return (
      <div
        className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
      >
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Store credit
        </h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-800">
          <RiWallet3Line className="shrink-0 text-lg text-blue-600" />
          <span>440 store wallet balance:</span>
          {balanceNode}
        </div>
      </div>
    );
  }

  // "row" variant — compact for headers, checkout panels, etc.
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-800 ${className}`}>
      <RiWallet3Line className="shrink-0 text-lg text-blue-600" />
      <span>440 store wallet balance:</span>
      {balanceNode}
    </div>
  );
}
