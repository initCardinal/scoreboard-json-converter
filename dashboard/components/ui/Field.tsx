"use client";

import React, { useId } from "react";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  placeholder?: string;
  fullWidth?: boolean;
}

export function SelectField({
  label,
  options,
  placeholder,
  fullWidth,
  className,
  ...rest
}: SelectProps) {
  const id = useId();
  return (
    <div className={clsx("flex flex-col gap-1", fullWidth ? "w-full" : "min-w-[140px]")}>
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        id={id}
        className={clsx(
          "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          className
        )}
        {...rest}
      >
        <option value="">{placeholder ?? "Any"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fullWidth?: boolean;
}

export function TextField({ label, fullWidth, className, ...rest }: TextProps) {
  const id = useId();
  return (
    <div className={clsx("flex flex-col gap-1", fullWidth ? "w-full" : "min-w-[200px]")}>
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={clsx(
          "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          className
        )}
        {...rest}
      />
    </div>
  );
}

interface CheckProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CheckboxField({ label, className, ...rest }: CheckProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none min-h-[40px]"
    >
      <input
        id={id}
        type="checkbox"
        className={clsx("accent-gray-700 w-4 h-4", className)}
        {...rest}
      />
      {label}
    </label>
  );
}
