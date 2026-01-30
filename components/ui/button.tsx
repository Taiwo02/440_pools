import { cn } from "./utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: string | React.ReactNode;
  primary?: boolean;
  isFullWidth?: boolean;
};

const Button = ({ className, children, primary, isFullWidth, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        `px-6 py-3 rounded-2xl ${primary ? "bg-(--primary)" : "bg-(--secondary)"
        } text-white ${primary
          ? "hover:bg-(--primary-soft) hover:text-black"
          : "hover:bg-(--secondary-hover)"
        } transition-all cursor-pointer ${isFullWidth && 'w-full'} disabled:opacity-50 disabled:cursor-not-allowed`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;