import { RiLoader4Fill } from "react-icons/ri";
import React from "react";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  primary?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
};

const Button = ({
  className,
  children,
  primary,
  isFullWidth,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        `flex gap-2 items-center justify-center px-6 py-3 rounded-2xl
        ${primary ? "bg-(--primary)" : "bg-(--secondary)"}
        text-white
        ${primary ? "hover:bg-(--primary-soft) hover:text-black" : "hover:bg-(--secondary-hover)"}
        transition-all
        cursor-pointer
        ${isFullWidth && "w-full"}
        disabled:opacity-50 disabled:cursor-not-allowed`,
        className
      )}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {isLoading && <RiLoader4Fill className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;