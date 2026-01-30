"use client";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { cn } from "./utils";

type DropdownProps<T extends string | number> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  className
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn("w-full bg-(--bg-surface) border border-slate-200 px-3 py-2 rounded-md flex justify-between items-center", className)}
      >
        <span>{value}</span>
        <span><RiArrowDownSLine /></span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 p-2 w-full bg-(--bg-surface) border border-(--border-muted) rounded-md shadow-lg overflow-auto h-100">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "px-3 py-2 rounded cursor-pointer",
                opt === value ? "bg-slate-100 font-medium" : "hover:bg-slate-100"
              )}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;