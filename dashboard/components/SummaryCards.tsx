"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { ScoreboardOutput } from "@/lib/scoreboard-types";
import { stagger, fadeUp } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface Props {
  output: ScoreboardOutput;
}

export function SummaryCards({ output }: Props) {
  const reduce = useReducedMotionSafe();
  const sheet = output.sheets[0];
  if (!sheet) return null;

  const { dimensions, columns, merged_ranges, scoreboard } = sheet;
  const { metrics, records, formula_audit } = scoreboard;
  const hidden = columns.filter((c) => c.hidden).length;
  const spacers = columns.filter((c) => c.is_spacer).length;
  const errors = formula_audit.filter((f) => f.has_error).length;

  const cards = [
    { label: "Sheets", value: output.workbook.sheet_count },
    { label: "Rows", value: dimensions.max_row },
    { label: "Columns", value: dimensions.max_column },
    { label: "Metrics", value: metrics.length },
    { label: "Date Rows", value: records.length },
    { label: "Formulas", value: formula_audit.length },
    { label: "Formula Errors", value: errors, highlight: errors > 0 },
    { label: "Hidden Cols", value: hidden },
    { label: "Spacer Cols", value: spacers },
    { label: "Merged Ranges", value: merged_ranges.length },
  ];

  const motionProps = reduce
    ? {}
    : { variants: stagger, initial: "hidden" as const, animate: "visible" as const };
  const itemProps = reduce ? {} : { variants: fadeUp };

  return (
    <motion.dl
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      {...motionProps}
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          {...itemProps}
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 min-h-[78px]"
        >
          <dt className="text-xs text-gray-500 font-medium">{card.label}</dt>
          <dd
            className={clsx(
              "text-2xl font-semibold tabular-nums mt-0.5",
              card.highlight ? "text-red-600" : "text-gray-900"
            )}
          >
            {card.value}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
