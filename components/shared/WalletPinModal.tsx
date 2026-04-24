"use client";

import { useEffect, useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { RiCloseLine, RiLoader4Line, RiLockPasswordLine } from "react-icons/ri";

interface WalletPinModalProps {
  open: boolean;
  /** Formatted amount string e.g. "₦ 12,000.00" */
  amount: string;
  isLoading?: boolean;
  onConfirm: (pin: string) => void;
  onClose: () => void;
}

export default function WalletPinModal({
  open,
  amount,
  isLoading,
  onConfirm,
  onClose,
}: WalletPinModalProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset & focus first input whenever modal opens
  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 80);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const next = [...digits];
    text.split("").forEach((c, i) => { if (i < 4) next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(text.length, 3);
    inputRefs[focusIdx].current?.focus();
  };

  const pin = digits.join("");
  const ready = pin.length === 4 && !isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <RiLockPasswordLine className="text-xl text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">Wallet PIN</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <p className="text-center text-sm text-gray-500">
            Paying{" "}
            <span className="font-semibold text-gray-900">{amount}</span>{" "}
            from your 440 wallet
          </p>

          {/* 4-digit boxes */}
          <div className="mt-6 flex justify-center gap-3">
            {inputRefs.map((ref, i) => (
              <input
                key={i}
                ref={ref}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className="h-13 w-13 rounded-xl border-2 border-gray-200 text-center text-2xl font-bold text-gray-900 transition-colors focus:border-(--primary) focus:outline-none disabled:opacity-50"
                aria-label={`PIN digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onConfirm(pin)}
            disabled={!ready}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-(--primary) py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RiLoader4Line className="animate-spin text-lg" />
                Processing…
              </>
            ) : (
              "Confirm payment"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
