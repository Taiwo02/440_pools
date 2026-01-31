"use client"

import { useEffect, useState } from "react";
import { ToastItem, ToastPlacement } from "@/types/types";

type Props = ToastItem & {
  placement: ToastPlacement;
  onClose: () => void;
};

const Toast = ({
  title,
  description,
  icon,
  variant = "default",
  duration = 6000,
  placement,
  onClose,
}: Props) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => startExit(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const startExit = () => {
    setLeaving(true);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`
        pointer-events-auto min-w-70 max-w-sm
        rounded-xl border p-4 backdrop-blur-xl shadow-lg
        transition-all duration-200 ease-out
        ${leaving
          ? "opacity-0 translate-x-6"
          : "opacity-100 translate-x-0"
        }
        ${placement === "bottom-right"
          ? "animate-slide-in-bottom"
          : "animate-slide-in-top"
        }
        ${variant === "primary"
          ? "border-(--primary)/40 bg-(--primary)/10 text-(--primary)"
          : variant === "secondary"
            ? "border-(--secondary)/40 bg-(--secondary)/10 text-(--secondary)"
            : variant === "success"
              ? "border-green-400 bg-green-100 text-green-600"
              : variant === "warning"
                ? "border-amber-400 bg-amber-100 text-amber-600"
                : variant === "danger"
                  ? "border-red-400 bg-red-200 text-red-600"
                  : "border-gray-300 bg-white text-gray-800"
        }
      `}
    >
      <div className="flex gap-3 items-start">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-lg">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>

        <button
          onClick={startExit}
          className="text-sm opacity-50 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;