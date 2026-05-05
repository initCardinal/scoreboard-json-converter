"use client";

import React from "react";

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-3">
      <div>
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
