"use client";

import { useEffect, useState } from "react";
import { cn } from "../ui/utils";

type CountdownProps = {
  endDate: string;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (endDate: string): TimeLeft => {
  const diff = new Date(endDate).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export default function Countdown({ endDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(endDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex gap-0.5 text-center">
      <TimeBlock label="d" value={timeLeft.days} className={className} />:
      <TimeBlock label="h" value={timeLeft.hours} className={className} />:
      <TimeBlock label="m" value={timeLeft.minutes} className={className} />:
      <TimeBlock label="s" value={timeLeft.seconds} className={className} />
    </div>
  );
}

function TimeBlock({ label, value, className }: { label: string; value: number, className?: string }) {
  return (
    <div className={"flex items-center"}>
      <span className={cn("text-2xl font-semibold", className)}>
        {value}
      </span>
      <span className={cn("", className)}>{label}</span>
    </div>
  );
}