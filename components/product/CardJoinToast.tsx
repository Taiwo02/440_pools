"use client";

import { useEffect, useState } from "react";
import { RiUserFill, RiHeartFill } from "react-icons/ri";

const MOCK_LIKES = [
  { name: "Ada" },
  { name: "Tunde" },
  { name: "Amaka" },
  { name: "Chidi" },
  { name: "Zainab" },
  { name: "Emeka" },
  { name: "Ngozi" },
  { name: "Ibrahim" },
];

const SHOW_MS = 3500;
const ANIM_MS = 750;
const EXIT_UP_PX = 20;
const ENTER_FROM_BELOW_PX = 24;
const CYCLE_MS = SHOW_MS + ANIM_MS * 2;

type Phase = "visible" | "exiting" | "entering";

type Props = {
  /** Stable id (e.g. bale.id) so only some cards show toast and timing is staggered */
  cardId: number;
};

export default function CardJoinToast({ cardId }: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("visible");
  const [enterShown, setEnterShown] = useState(false);
  const [started, setStarted] = useState(false);

  // Only show on ~1/3 of cards (deterministic by cardId)
  const showToast = cardId % 3 === 0;
  const startDelay = (cardId * 600) % CYCLE_MS;

  // Stagger: start the cycle after a delay so not all cards animate at once
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(t);
  }, [showToast, startDelay]);

  // Cycle: visible → exiting → (swap message) → entering → visible
  useEffect(() => {
    if (!showToast || !started) return;
    const interval = setInterval(() => {
      setPhase("exiting");
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [showToast, started]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % MOCK_LIKES.length);
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

  const { name } = MOCK_LIKES[index];

  const isExiting = phase === "exiting";
  const isEntering = phase === "entering";
  const isEnteringFromBottom = isEntering && !enterShown;

  // When entering from below: no transition on first frame so we snap to "below" position,
  // then transition runs when we animate up to final position (avoids animating from exit -20px)
  const isEnterInitial = isEnteringFromBottom;
  const useTransition = !isEnterInitial;

  if (!showToast) return null;

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
        <p className="text-[10px] leading-tight text-white/95 truncate flex items-center gap-1">
          <span className="text-amber-400 font-medium">{name}</span>
          <span className="text-white/80"> liked</span>
          <RiHeartFill className="shrink-0 text-red-400/90" size={10} />
        </p>
      </div>
    </div>
  );
}
