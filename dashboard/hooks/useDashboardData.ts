"use client";

import { useCallback, useState } from "react";
import { ScoreboardOutput } from "@/lib/scoreboard-types";

export type DashboardStatus =
  | "idle"
  | "converting"
  | "loading_output"
  | "ready"
  | "error";

export interface DashboardError {
  title: string;
  message: string;
  detail?: string;
}

export interface DashboardState {
  status: DashboardStatus;
  output: ScoreboardOutput | null;
  error: DashboardError | null;
  notice: string | null;
  runConverter: () => Promise<void>;
  refreshOutput: () => Promise<void>;
}

async function fetchOutput(): Promise<ScoreboardOutput> {
  const res = await fetch("/api/output", { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Output fetch failed (${res.status})`);
  }
  return (await res.json()) as ScoreboardOutput;
}

export function useDashboardData(): DashboardState {
  const [status, setStatus] = useState<DashboardStatus>("idle");
  const [output, setOutput] = useState<ScoreboardOutput | null>(null);
  const [error, setError] = useState<DashboardError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshOutput = useCallback(async () => {
    setError(null);
    setNotice(null);
    setStatus("loading_output");
    try {
      const data = await fetchOutput();
      setOutput(data);
      setStatus("ready");
    } catch (e) {
      setOutput(null);
      setError({
        title: "Could not load output.json",
        message: e instanceof Error ? e.message : "Unexpected error.",
      });
      setStatus("error");
    }
  }, []);

  const runConverter = useCallback(async () => {
    setError(null);
    setNotice(null);
    setStatus("converting");
    try {
      const res = await fetch("/api/convert", { method: "POST" });
      const body = await res.json();
      if (body.localOnly) {
        setNotice(body.message);
        setStatus("loading_output");
        const data = await fetchOutput();
        setOutput(data);
        setStatus("ready");
        return;
      }
      if (!body.success) {
        setStatus("error");
        setError({
          title: "Converter failed",
          message: "The converter exited with a non-zero status.",
          detail: (body.stderr || body.stdout || "").trim() || undefined,
        });
        return;
      }
      setStatus("loading_output");
      const data = await fetchOutput();
      setOutput(data);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError({
        title: "Could not run converter",
        message: e instanceof Error ? e.message : "Unexpected error.",
      });
    }
  }, []);

  return { status, output, error, notice, runConverter, refreshOutput };
}
