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

type TabsContextType = {
  activeValue: string;
  setActiveValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return ctx;
};

/* ------------------------------------------------------------------ */
/* Root */
/* ------------------------------------------------------------------ */

type TabsProps = {
  defaultValue: string;
  className?: string;
  children: ReactNode;
};

function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeValue, setActiveValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* List */
/* ------------------------------------------------------------------ */

type TabsListProps = {
  className?: string;
  children: ReactNode;
};

function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn("flex gap-2 flex-wrap", className)}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trigger */
/* ------------------------------------------------------------------ */

type TabsTriggerProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

function TabsTrigger({
  value,
  className,
  children,
}: TabsTriggerProps) {
  const { activeValue, setActiveValue } = useTabs();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setActiveValue(value)}
      className={cn(className)}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Content */
/* ------------------------------------------------------------------ */

type TabsContentProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

function TabsContent({
  value,
  className,
  children,
}: TabsContentProps) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-state="active"
      className={cn(className)}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compound Exports */
/* ------------------------------------------------------------------ */

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs };
