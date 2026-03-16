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

const SHOW_MS = 3500;
const ANIM_MS = 750;       // slower fade out / fade in
const EXIT_UP_PX = 20;     // exiting: scroll up (negative Y) toward top
const ENTER_FROM_BELOW_PX = 24;  // entering: start below final position, then scroll up into place

type Phase = "visible" | "exiting" | "entering";

export default function CardJoinToast() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("visible");
  const [enterShown, setEnterShown] = useState(false);

  // Cycle: visible → exiting → (swap message) → entering → visible
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase("exiting");
    }, SHOW_MS + ANIM_MS * 2);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % MOCK_JOINS.length);
      setEnterShown(false);
      setPhase("entering");
    }, ANIM_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Force browser to paint "from bottom" state before we animate to final position
  useEffect(() => {
    if (phase !== "entering") return;
    const t = setTimeout(() => setEnterShown(true), 50);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "entering" || !enterShown) return;
    const t = setTimeout(() => {
      setPhase("visible");
      setEnterShown(false);
    }, ANIM_MS);
    return () => clearTimeout(t);
  }, [phase, enterShown]);

  const { name, slots } = MOCK_JOINS[index];
  const slotText = slots === 1 ? "1 slot" : `${slots} slots`;

  const isExiting = phase === "exiting";
  const isEntering = phase === "entering";
  const isEnteringFromBottom = isEntering && !enterShown;

  // When entering from below: no transition on first frame so we snap to "below" position,
  // then transition runs when we animate up to final position (avoids animating from exit -20px)
  const isEnterInitial = isEnteringFromBottom;
  const useTransition = !isEnterInitial;

  return (
    <div
      className="absolute bottom-2 left-2 z-10 max-w-[calc(100%-1rem)] ease-out"
      style={{
        transition: useTransition ? `transform ${ANIM_MS}ms ease-out, opacity ${ANIM_MS}ms ease-out` : "none",
        opacity: isExiting ? 0 : isEnteringFromBottom ? 0 : 1,
        transform: isExiting
          ? `translateY(-${EXIT_UP_PX}px)`   // fade out: scroll up toward top
          : isEnteringFromBottom
            ? `translateY(${ENTER_FROM_BELOW_PX}px)`  // fade in: start below, scroll up into place
            : "translateY(0)",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-1.5 rounded-lg bg-black/75 px-2 py-1.5 shadow backdrop-blur-sm border border-white/10">
        <div className="w-5 h-5 shrink-0 rounded-full bg-(--primary-soft) flex items-center justify-center text-(--primary)">
          <RiUserFill size={10} />
        </div>
        <p className="text-[10px] leading-tight text-white/95 truncate">
          <span className="text-amber-400 font-medium">{name}</span>
          <span className="text-white/80"> · </span>
          <span className="text-(--primary) font-semibold">{slotText}</span>
        </p>
      </div>
    </div>
  );
}
