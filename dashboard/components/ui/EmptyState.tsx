"use client";

import React from "react";
import clsx from "clsx";

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className
      )}
    >
      {icon && <div className="mb-3 text-gray-400">{icon}</div>}
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
