"use client";

import React, { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { cn } from "./utils";

type CheckboxOption = {
  value: string;
  label?: string;
  node?: React.ReactNode;
};

type Props = {
  element: "input" | "select" | "textarea";
  input_type?: "text" | "email" | "password" | "radio" | "checkbox" | "number";
  name: string;
  value: string | string[] | number | number[];
  handler: (e: React.ChangeEvent<any>) => void;

  tag?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  selectOptions?: string[];
  radioOptions?: string[];
  checkboxOptions?: CheckboxOption[];
  invisible?: boolean;

  styling?: string;
  genStyle?: string;

  leftIcon?: React.ReactNode;
};

const InputWrapper = ({
  children,
  leftIcon,
}: {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
}) => (
  <div className="relative flex items-center">
    {leftIcon && (
      <span className="absolute left-3 text-gray-400 pointer-events-none">
        {leftIcon}
      </span>
    )}
    {children}
  </div>
);

const Input = React.memo(({
  element,
  input_type = "text",
  name,
  value,
  handler,
  tag,
  placeholder,
  required,
  disabled,
  selectOptions = [],
  radioOptions = [],
  checkboxOptions = [],
  styling = "",
  genStyle = "",
  leftIcon
}: Props) => {
  const [visible, setVisible] = useState(false);
  const togglePassword = () => setVisible(prev => !prev);

  // SELECT
  if (element === "select") {
    return (
      <div className={cn("my-4", genStyle)}>
        {tag && <label className="block font-semibold mb-1">{tag}</label>}
        <select
          name={name}
          value={value as string}
          onChange={handler}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full p-3 bg-[var(--bg-surface)] rounded-lg border border-slate-200 focus:border focus:outline-[var(--primary)] placeholder:text-[var(--muted)]",
            styling
          )}
        >
          <option value="">{placeholder}</option>
          {selectOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  // TEXTAREA
  if (element === "textarea") {
    return (
      <div className={cn("my-4", genStyle)}>
        {tag && <label className="block font-semibold mb-1">{tag}</label>}
        <textarea
          name={name}
          value={value as string}
          onChange={handler}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={5}
          className={cn(
            "w-full p-3 bg-[var(--bg-surface)] rounded-lg border border-slate-200 focus:border focus:outline-[var(--primary)]",
            styling
          )}
        />
      </div>
    );
  }

  // RADIO
  if (input_type === "radio" && radioOptions.length > 0) {
    return (
      <div className={cn("my-4", genStyle)}>
        {tag && <label className="block font-semibold mb-1">{tag}</label>}
        <div className={`grid grid-cols-1 ${radioOptions.length < 3 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-3`}>
          {radioOptions.map(option => {
            const checked = value === option;
            return (
              <label
                key={option}
                className={cn(
                  "border rounded-lg p-3 cursor-pointer transition",
                  checked ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-gray-300 hover:border-[var(--primary)]",
                  styling
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={checked}
                  onChange={handler}
                  required={required}
                  disabled={disabled}
                  className="hidden"
                />
                <span className="capitalize">{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // CHECKBOX
  if (input_type === "checkbox" && checkboxOptions.length > 0) {
    return (
      <div className={cn("my-4", genStyle)}>
        {tag && <label className="block font-semibold mb-1">{tag}</label>}
        <div className="flex flex-wrap gap-2">
          {checkboxOptions.map(option => {
            const checked = Array.isArray(value) && (value as string[]).includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "border rounded-md p-2 cursor-pointer transition flex items-center justify-center",
                  checked ? "border-[var(--primary)] ring-2 ring-[var(--primary)]" : "border-gray-300 hover:border-[var(--primary)]",
                  styling
                )}
              >
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={checked}
                  onChange={handler}
                  disabled={disabled}
                  className="hidden"
                />
                {option.node ?? <span className="capitalize text-sm">{option.label}</span>}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // INPUT (password or default)
  return (
    <div className={cn("my-4", genStyle)}>
      {tag && <label className="block font-semibold mb-1">{tag}</label>}
      <InputWrapper leftIcon={leftIcon}>
        <input
          type={input_type === "password" ? (visible ? "text" : "password") : input_type}
          name={name}
          value={value as string}
          onChange={handler}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full p-3 bg-[var(--bg-surface)] rounded-lg border border-slate-200 focus:border focus:outline-[var(--primary)]",
            !!leftIcon && "pl-10",
            styling
          )}
        />
        {input_type === "password" && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
          >
            {visible ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        )}
      </InputWrapper>
    </div>
  );
});

export default Input;