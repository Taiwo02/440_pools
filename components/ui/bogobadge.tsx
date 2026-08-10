import { RiGiftLine } from "react-icons/ri";
import { cn } from "./utils";

type BogoBadgeProps = {
  variant?: "badge" | "banner";
  className?: string;
};

export const BogoBadge = ({ variant = "badge", className }: BogoBadgeProps) => {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-orange-50 border border-orange-200 text-(--primary) px-3 py-2 rounded-lg text-sm font-medium",
          className,
        )}
      >
        <RiGiftLine className="text-lg shrink-0" />
        <span>Buy 2, Get 1 Free</span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 bg-(--primary) text-white text-xs font-semibold px-2 py-1 rounded-full",
        className,
      )}
    >
      <RiGiftLine className="text-sm" />
      2-FOR-1
    </span>
  );
};
