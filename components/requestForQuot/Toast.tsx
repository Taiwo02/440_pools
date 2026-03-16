"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { RiCheckLine, RiCloseLine, RiErrorWarningLine, RiInformationLine } from "react-icons/ri";

export type ToastType = "success" | "error" | "info" | "warning";

type ToastProps = {
  show: boolean;
  type?: ToastType;
  message: string;
  onClose: () => void;
};

const typeConfig: Record<
  ToastType,
  { color: string; icon: React.ReactNode }
> = {
  success: {
    color: "var(--primary, #FF7A00)",
    icon: <RiCheckLine className="w-6 h-6" />,
  },
  error: {
    color: "#D93025",
    icon: <RiCloseLine className="w-6 h-6" />,
  },
  info: {
    color: "#0D6EFD",
    icon: <RiInformationLine className="w-6 h-6" />,
  },
  warning: {
    color: "#FFC107",
    icon: <RiErrorWarningLine className="w-6 h-6" />,
  },
};

export default function Toast({ show, type = "success", message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[9999]"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border-l-4 bg-white text-gray-800 min-w-0 max-w-md mx-auto"
            style={{
              borderColor: config.color,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ color: config.color }}>{config.icon}</span>
            <div className="flex-1 font-semibold text-sm truncate">{message}</div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-gray-400 hover:text-gray-700 transition p-1"
              aria-label="Close"
            >
              <RiCloseLine size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
