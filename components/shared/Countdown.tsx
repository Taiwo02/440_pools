"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  endDate: string; // ISO date string
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

export default function Countdown({ endDate }: CountdownProps) {
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
      <TimeBlock label="d" value={timeLeft.days} />:
      <TimeBlock label="h" value={timeLeft.hours} />:
      <TimeBlock label="m" value={timeLeft.minutes} />:
      <TimeBlock label="s" value={timeLeft.seconds} />
    </div>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-end">
      <span className="text-2xl font-semibold">
        {value}
      </span>
      <span>{label}</span>
    </div>
  );
}