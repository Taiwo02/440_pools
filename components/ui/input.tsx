"use client";

import { useRef, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { cn } from "./utils";

type Props = {
  element: "input" | "select" | "textarea";
  input_type?: "text" | "email" | "password" | "radio" | "checkbox" | "number";
  name: string;
  value: string | string[] | number | number[];
  handler: (e: React.ChangeEvent<any>) => void;

  tag?: string;
  placeholder?: string;
  required?: boolean;

  selectOptions?: string[];
  radioOptions?: string[];
  checkboxOptions?: string[];

  styling?: string;
  genStyle?: string
};

const Input = ({
  element,
  input_type = "text",
  name,
  value,
  handler,
  tag,
  placeholder,
  required,
  selectOptions = [],
  radioOptions = [],
  checkboxOptions = [],
  styling = "",
  genStyle = ""
}: Props) => {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className={cn("my-4", genStyle)}>
      {tag && <label className="block font-semibold mb-1">{tag}</label>}

      {/* SELECT */}
      {element === "select" && (
        <select
          name={name}
          value={value as string}
          onChange={handler}
          required={required}
          className={cn("w-full p-3 bg-(--bg-surface) rounded-lg border border-slate-200 focus:border focus:outline-(--primary) placeholder:text(--muted)", styling)}
        >
          <option value="" className="text-(--muted)">{placeholder}</option>
          {selectOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {/* TEXTAREA */}
      {element === "textarea" && (
        <textarea
          name={name}
          value={value as string}
          onChange={handler}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={cn("w-full p-3 bg-(--bg-surface) rounded-lg border border-slate-200 focus:border focus:outline-(--primary)", styling)}
        />
      )}

      {/* RADIO CARDS */}
      {input_type === "radio" && radioOptions.length > 0 && (
        <div className={`grid grid-cols-1 ${radioOptions.length < 3 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
          {radioOptions.map((option) => {
            const checked = value === option;

            return (
              <label
                key={option}
                className={`border rounded-lg p-3 cursor-pointer transition
                ${checked
                    ? "border-(--primary) bg-(--primary) text-white"
                    : "border-gray-300 hover:border-(--primary)"
                  }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={checked}
                  onChange={handler}
                  required={required}
                  className="hidden"
                />
                <span className="capitalize">{option}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* CHECKBOX (Single & Group) */}
      {input_type === "checkbox" && (
        <div className="flex flex-wrap gap-2">
          {checkboxOptions.length ? (
            checkboxOptions.map((option: string) => {
              const checked =
                Array.isArray(value) && typeof value[0] === "string"
                  ? (value as string[]).includes(option)
                  : false;

              return (
                <label
                  key={option}
                  className={`w-fit border rounded-md p-3 cursor-pointer transition flex items-center gap-3
                  ${checked
                      ? "border-(--primary) bg-(--primary) text-white"
                      : "border-gray-300 hover:border-(--primary)"
                    }`}
                >
                  <input
                    type="checkbox"
                    name={name}
                    value={option}
                    checked={checked}
                    onChange={handler}
                    className="hidden"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              );
            })
          ) : (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={Boolean(value)}
                onChange={handler}
                required={required}
              />
              <span>{placeholder}</span>
            </label>
          )}
        </div>
      )}

      {/* PASSWORD */}
      {element === "input" && input_type === "password" && (
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            name={name}
            value={value as string}
            onChange={handler}
            placeholder={placeholder}
            required={required}
            className={cn("w-full p-3 bg-(--bg-surface) rounded-lg border border-slate-200 focus:border focus:outline-(--primary)", styling)}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
          >
            {visible ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
      )}


      {/* DEFAULT INPUT */}
      {element === "input" &&
        input_type !== "password" &&
        input_type !== "radio" &&
        input_type !== "checkbox" && (
          <input
            type={input_type}
            name={name}
            value={value as string}
            onChange={handler}
            placeholder={placeholder}
            required={required}
            className={cn("w-full p-3 bg-(--bg-surface) rounded-lg border border-slate-200 focus:border focus:outline-(--primary)", styling)}
          />
        )}
    </div>
  );
};

export default Input;