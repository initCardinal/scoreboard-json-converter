"use client";

import React from "react";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...rest }: Props) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        padded && "p-4 sm:p-5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
