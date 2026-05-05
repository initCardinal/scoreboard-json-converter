"use client";

import clsx from "clsx";
import { CheckCircle2, Loader2, AlertCircle, Circle } from "lucide-react";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface Props {
  status: DashboardStatus;
}

const labels: Record<DashboardStatus, string> = {
  idle: "Idle",
  converting: "Converting",
  loading_output: "Loading output",
  ready: "Ready",
  error: "Error",
};

const styles: Record<DashboardStatus, string> = {
  idle: "bg-gray-100 text-gray-600 border-gray-200",
  converting: "bg-blue-50 text-blue-700 border-blue-200",
  loading_output: "bg-blue-50 text-blue-700 border-blue-200",
  ready: "bg-green-50 text-green-700 border-green-200",
  error: "bg-red-50 text-red-700 border-red-200",
};

export function StatusPill({ status }: Props) {
  const Icon =
    status === "ready"
      ? CheckCircle2
      : status === "error"
      ? AlertCircle
      : status === "converting" || status === "loading_output"
      ? Loader2
      : Circle;

  const spin = status === "converting" || status === "loading_output";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full",
        styles[status]
      )}
      role="status"
      aria-live="polite"
    >
      <Icon size={12} className={clsx(spin && "animate-spin")} aria-hidden />
      {labels[status]}
    </span>
  );
}
