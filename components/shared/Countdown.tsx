"use client";

import { useEffect, useState } from "react";
import { cn } from "../ui/utils";
import { RiFlashlightFill, RiTimeFill } from "react-icons/ri";

type CountdownProps = {
  endDate: string;
  className?: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Total whole hours (unbounded), minutes 0–59, seconds 0–59 — e.g. 631:12:00 */
const formatHms = (endDate: string): { text: string; ended: boolean } => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) {
    return { text: "Ended", ended: true };
  }
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return {
    text: `${totalHours}:${pad2(minutes)}:${pad2(seconds)}`,
    ended: false,
  };
};

export default function Countdown({ endDate, className }: CountdownProps) {
  const [snapshot, setSnapshot] = useState(() => formatHms(endDate));

  useEffect(() => {
    const tick = () => setSnapshot(formatHms(endDate));
    tick();
    const interval = setInterval(tick, 1_000);
    return () => clearInterval(interval);
  }, [endDate]);

  const { text, ended } = snapshot;

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
