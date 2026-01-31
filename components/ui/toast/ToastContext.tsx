"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { ToastItem, ToastPlacement } from "@/types/types";
import Toast from "./toast";

type CreateToast = Omit<ToastItem, "id">;

type ToastContextType = {
  toast: (data: CreateToast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({
  children,
  placement = "bottom-right",
}: {
  children: React.ReactNode;
  placement?: ToastPlacement;
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((data: CreateToast) => {
    setToasts((prev) => [
      ...prev,
      { ...data, id: crypto.randomUUID() },
    ]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div
        className={`fixed z-50 flex flex-col gap-3 ${placement === "bottom-right"
            ? "bottom-4 right-4"
            : "top-4 right-4"
          }`}
      >
        {toasts.map((t) => (
          <Toast 
            key={t.id}
            {...t}
            placement={placement}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
