"use client";

import React from "react";
import clsx from "clsx";

export interface MobileDataRow {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  rows: MobileDataRow[];
  formula?: string | null;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileDataCard({
  title,
  subtitle,
  badges,
  rows,
  formula,
  footer,
  className,
}: Props) {
  return (
    <article
      className={clsx(
        "bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3",
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 break-words">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 break-words">{subtitle}</p>
          )}
        </div>
        {badges && <div className="flex flex-wrap gap-1.5 shrink-0">{badges}</div>}
      </header>

      {rows.length > 0 && (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5 text-xs">
          {rows.map((row, i) => (
            <React.Fragment key={i}>
              <dt className="text-gray-500 uppercase tracking-wide font-medium">
                {row.label}
              </dt>
              <dd
                className={clsx(
                  "text-gray-900 break-words min-w-0",
                  row.mono && "font-mono"
                )}
              >
                {row.value !== null && row.value !== undefined && row.value !== "" ? (
                  row.value
                ) : (
                  <span className="text-gray-300">null</span>
                )}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      )}

      {formula && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
            Formula
          </p>
          <pre className="text-xs font-mono bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto whitespace-pre">
            {formula}
          </pre>
        </div>
      )}

      {footer && <footer className="pt-1">{footer}</footer>}
    </article>
  );
}
