"use client";

import { useEffect, useState } from "react";
import { cn } from "../ui/utils";
import { RiFlashlightFill, RiTimeFill } from "react-icons/ri";

type CountdownProps = {
  endDate: string;
  className?: string;
  /** Default: floating pill on images. `inline` = plain text for tables/cards. */
  variant?: "badge" | "inline";
};

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_HOUR = 60 * 60 * 1000;
const MS_MIN = 60 * 1000;

/** >24h → days; (1h, 24h] → hours; ≤1h → minutes + seconds */
const formatRemaining = (endDate: string): { text: string; ended: boolean } => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) {
    return { text: "Ended", ended: true };
  }
  if (diff > MS_DAY) {
    const days = Math.floor(diff / MS_DAY);
    return {
      text: days === 1 ? "1 day left" : `${days} days left`,
      ended: false,
    };
  }
  if (diff > MS_HOUR) {
    const hours = Math.floor(diff / MS_HOUR);
    return {
      text: hours === 1 ? "1hr left" : `${hours}hrs left`,
      ended: false,
    };
  }
  const minutes = Math.floor(diff / MS_MIN);
  const seconds = Math.floor((diff / 1000) % 60);
  return {
    text: `${minutes}m ${seconds}s left`,
    ended: false,
  };
};

export default function Countdown({
  endDate,
  className,
  variant = "badge",
}: CountdownProps) {
  const [snapshot, setSnapshot] = useState(() => formatRemaining(endDate));

  useEffect(() => {
    const tick = () => setSnapshot(formatRemaining(endDate));
    tick();
    const interval = setInterval(tick, 1_000);
    return () => clearInterval(interval);
  }, [endDate]);

  const { text, ended } = snapshot;

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-semibold tabular-nums",
          ended ? "text-red-600" : "text-gray-900",
          className
        )}
      >
        {ended ? (
          <RiFlashlightFill className="shrink-0" aria-hidden />
        ) : (
          <RiTimeFill className="shrink-0 text-(--primary)" aria-hidden />
        )}
        {text}
      </span>
    );
  }

  return (
    <div
      className={cn(
        `absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full ${
          ended ? "bg-red-500/70" : "bg-(--primary)"
        } px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xl`,
        className
      )}
    >
      {ended ? (
        <RiFlashlightFill className="shrink-0" aria-hidden />
      ) : (
        <RiTimeFill className="shrink-0" aria-hidden />
      )}
      <span className="font-mono font-semibold tabular-nums tracking-tight">
        {text}
      </span>
    </div>
  );
}
