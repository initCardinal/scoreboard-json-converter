"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { flattenRecords } from "@/lib/aggregate";
import { fade } from "@/lib/motion";
import RunConverterPanel from "./RunConverterPanel";
import { DashboardStartState } from "./dashboard/DashboardStartState";
import { DashboardContent } from "./dashboard/DashboardContent";
import { LoadingPanel } from "./ui/LoadingPanel";
import { ErrorPanel } from "./ui/ErrorPanel";

export default function DashboardShell() {
  const { status, output, error, notice, runConverter, refreshOutput } = useDashboardData();
  const reduce = useReducedMotionSafe();
  const flatRows = useMemo(() => (output ? flattenRecords(output) : []), [output]);

  const wrap = (key: string, node: React.ReactNode) =>
    reduce ? (
      <div key={key}>{node}</div>
    ) : (
      <motion.div
        key={key}
        variants={fade}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {node}
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Scoreboard JSON Converter
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Internal clinic performance scoreboard, Excel to JSON.
          </p>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 space-y-6 max-w-screen-2xl mx-auto">
        <RunConverterPanel
          status={status}
          output={output}
          notice={notice}
          onRun={runConverter}
          onRefresh={refreshOutput}
        />

        <AnimatePresence mode="wait" initial={false}>
          {status === "idle" && wrap("idle", <DashboardStartState />)}
          {status === "converting" &&
            wrap(
              "converting",
              <LoadingPanel
                title="Running converter"
                description="Reading the workbook and writing output.json."
              />
            )}
          {status === "loading_output" &&
            !output &&
            wrap(
              "loading",
              <LoadingPanel
                title="Loading output"
                description="Reading the latest output.json."
              />
            )}
          {status === "error" && error &&
            wrap(
              "error",
              <ErrorPanel title={error.title} message={error.message} detail={error.detail} />
            )}
          {status === "ready" && output &&
            wrap("ready", <DashboardContent output={output} flatRows={flatRows} />)}
        </AnimatePresence>
      </main>
    </div>
  );
}
