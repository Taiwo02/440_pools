"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

type AccordionContextType = {
  openId: string | null;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return ctx;
};

/* Root */
type AccordionProps = {
  defaultOpenId?: string;
  className?: string;
  children: ReactNode;
};

function Accordion({
  defaultOpenId,
  className,
  children,
}: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId ?? null
  );

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

/* Item */
type AccordionItemProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

function AccordionItem({
  id,
  className,
  children,
}: AccordionItemProps) {
  return (
    <div
      data-accordion-item
      data-id={id}
      className={cn("border-b border-b-(--border-default)", className)}
    >
      {children}
    </div>
  );
}

/* Trigger */
type AccordionTriggerProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

function AccordionTrigger({
  id,
  className,
  children,
}: AccordionTriggerProps) {
  const { openId, toggle } = useAccordion();
  const isOpen = openId === id;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => toggle(id)}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "flex w-full items-center justify-between px-2 py-3 text-left font-medium",
        className
      )}
    >
      {children}
    </button>
  );
}

/* Content */
type AccordionContentProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

function AccordionContent({
  id,
  className,
  children,
}: AccordionContentProps) {
  const { openId } = useAccordion();
  const isOpen = openId === id;

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-all duration-300 overflow-hidden",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        <div className={cn("px-4 pb-4", className)}>{children}</div>
      </div>
    </div>
  );
}

/* Compound Exports */
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { Accordion };
