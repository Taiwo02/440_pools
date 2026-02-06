"use client";

import { useEffect, useState } from "react";
import { cn } from "../ui/utils";
import { RiFlashlightFill, RiTimeFill } from "react-icons/ri";

type CountdownProps = {
  endDate: string;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
};

const getTimeLeft = (endDate: string): TimeLeft => {
  const diff = new Date(endDate).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
};

export default function Countdown({ endDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 60_000); // update every minute (lighter than every second)

    return () => clearInterval(interval);
  }, [endDate]);

  const isEnded =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0;

  const renderTime = () => {
    if (isEnded) return "Ended";

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`;
    }

    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }

    return `${timeLeft.minutes}m`;
  };

  return (
    <div
      className={cn(
        `absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full ${(timeLeft.days < 0 && timeLeft.hours < 0) || isEnded ? "bg-red-500/70" : "bg-black/60"} px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-xl`,
        className
      )}
    >
      {
        (timeLeft.days < 0 && timeLeft.hours < 0) || isEnded ? 
        <RiFlashlightFill /> :
        <RiTimeFill />
      }
      <div className="flex gap-1 items-center">
        {!isEnded && <span>Ends in</span>}
        <span className="font-semibold">{renderTime()}</span>
      </div>
    </div>
  );
}