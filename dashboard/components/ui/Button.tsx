"use client";

import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800",
  secondary:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-400",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-2 min-h-[36px]",
  md: "text-sm px-4 py-2.5 min-h-[44px]",
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "secondary", size = "md", fullWidth, iconLeft, iconRight, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
});
