"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlatRecord } from "@/lib/scoreboard-types";
import { MobileDataCard } from "@/components/ui/MobileDataCard";
import { Button } from "@/components/ui/Button";
import { formatValue } from "@/lib/formatters";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface Props {
  rows: FlatRecord[];
  pageSize?: number;
}

export function RecordsTableMobile({ rows, pageSize = 25 }: Props) {
  const reduce = useReducedMotionSafe();
  const [count, setCount] = useState(pageSize);
  const visible = rows.slice(0, count);
  const hasMore = rows.length > count;

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {visible.map((r, i) => (
          <motion.div
            key={`${r.row}-${r.metric_id}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18, delay: Math.min(i, 6) * 0.02 }}
          >
            <MobileDataCard
              title={r.heading}
              subtitle={
                <span className="text-xs">
                  {r.date ?? "no date"} <span className="text-gray-300">|</span>{" "}
                  <code className="font-mono">{r.cell}</code>
                </span>
              }
              badges={
                <>
                  {r.has_formula && (
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded">fx</span>
                  )}
                  {r.has_error && (
                    <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded">err</span>
                  )}
                </>
              }
              rows={[
                {
                  label: "Value",
                  mono: true,
                  value:
                    r.value === null ? null : (
                      <span className={r.has_error ? "text-red-600" : ""}>
                        {formatValue(r.value)}
                      </span>
                    ),
                },
                { label: "Section", value: r.section },
                { label: "Focus", value: r.focus },
                { label: "Source", value: r.source },
                { label: "Role", value: r.role },
              ]}
              formula={r.formula}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <Button variant="secondary" onClick={() => setCount((c) => c + pageSize)} fullWidth>
          Show more ({rows.length - count} remaining)
        </Button>
      )}
    </div>
  );
}
