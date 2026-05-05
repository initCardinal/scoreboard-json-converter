"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, FileJson, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { fadeUp } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const points = [
  "The converter preserves the raw workbook structure (cells, formulas, hidden columns, merged ranges).",
  "Once converted, the dashboard appears below for you to inspect.",
  "From there you can filter, aggregate, audit formulas, and view the raw JSON.",
];

export function DashboardStartState() {
  const reduce = useReducedMotionSafe();

  return (
    <motion.div
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <Card className="text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Run the converter to begin
        </h2>
        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
          Generate the structured JSON from the source spreadsheet, then explore it here.
        </p>

        <ul className="mt-6 grid gap-3 text-left max-w-lg mx-auto">
          {points.map((p, i) => (
            <li
              key={i}
              className="flex gap-3 items-start text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md px-3 py-2"
            >
              <span className="text-gray-400 font-mono text-xs mt-0.5">{i + 1}</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
          <FileBadge icon={<FileSpreadsheet className="text-green-600" size={16} />} label="Source" name="Scoreboard Test.xlsx" />
          <FileBadge icon={<FileJson className="text-blue-600" size={16} />} label="Output" name="output.json" />
        </div>
      </Card>
    </motion.div>
  );
}

function FileBadge({ icon, label, name }: { icon: React.ReactNode; label: string; name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-white">
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-xs font-mono text-gray-800 truncate">{name}</p>
      </div>
    </div>
  );
}
