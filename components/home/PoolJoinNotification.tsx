"use client";

import { useEffect, useState } from "react";
import { RiUserFill } from "react-icons/ri";

const MOCK_JOINS = [
  { name: "Ada", slots: 2 },
  { name: "Tunde", slots: 1 },
  { name: "Amaka", slots: 3 },
  { name: "Chidi", slots: 2 },
  { name: "Zainab", slots: 1 },
  { name: "Emeka", slots: 4 },
  { name: "Ngozi", slots: 2 },
  { name: "Ibrahim", slots: 1 },
];

const PoolJoinNotification = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MOCK_JOINS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const { name, slots } = MOCK_JOINS[index];
  const slotText = slots === 1 ? "1 slot" : `${slots} slots`;

  return (
    <div
      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto max-w-sm z-50"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gray-900/95 px-3 py-2.5 shadow-lg border border-white/10 backdrop-blur-md">
        <div className="w-10 h-10 shrink-0 rounded-full bg-(--primary-soft) flex items-center justify-center text-(--primary)">
          <RiUserFill size={20} />
        </div>
        <p className="text-sm text-white/95">
          <span className="text-amber-400 font-medium">{name}</span>
          <span className="text-white/90"> joined </span>
          <span className="text-(--primary) font-semibold">{slotText}</span>
          <span className="text-white/70"> · just now</span>
        </p>
      </div>
    </div>
  );
};

export default PoolJoinNotification;
