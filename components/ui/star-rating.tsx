import { RiStarFill, RiStarLine } from "react-icons/ri";
import { cn } from "./utils";

type Props = {
  rating?: number; // 0–5
  max?: number;
  className?: string;
  size?: number;
};

const StarRating = ({ rating = 0, max = 5, className, size = 14 }: Props) => {
  const value = Math.min(max, Math.max(0, Math.round(rating)));
  const empty = max - value;

  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`Rating: ${value} out of ${max} stars`}>
      {Array.from({ length: value }).map((_, i) => (
        <RiStarFill key={`full-${i}`} size={size} className="text-amber-500 shrink-0" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <RiStarLine key={`empty-${i}`} size={size} className="text-amber-500/50 shrink-0" />
      ))}
    </div>
  );
};

export default StarRating;
