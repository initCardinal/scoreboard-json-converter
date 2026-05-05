"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MetricDefinition } from "@/lib/scoreboard-types";
import { MobileDataCard } from "@/components/ui/MobileDataCard";
import { Button } from "@/components/ui/Button";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface Props {
  metrics: MetricDefinition[];
  pageSize?: number;
}

export function MetricsTableMobile({ metrics, pageSize = 20 }: Props) {
  const reduce = useReducedMotionSafe();
  const [count, setCount] = useState(pageSize);
  const visible = metrics.slice(0, count);
  const hasMore = metrics.length > count;

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {visible.map((m, i) => (
          <motion.div
            key={m.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, delay: Math.min(i, 6) * 0.02 }}
          >
            <MobileDataCard
              title={m.heading}
              subtitle={<code className="font-mono break-all">{m.id}</code>}
              badges={
                <>
                  {m.hidden && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded">
                      hidden
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {m.column}
                  </span>
                </>
              }
              rows={[
                { label: "Section", value: m.section },
                { label: "Focus", value: m.focus },
                { label: "Source", value: m.source },
                { label: "Role", value: m.role },
                {
                  label: "Target",
                  value:
                    m.target.label || m.target.value !== null
                      ? `${m.target.label ?? ""}${m.target.value !== null ? ` ${m.target.value}` : ""}`.trim()
                      : null,
                },
              ]}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <Button variant="secondary" onClick={() => setCount((c) => c + pageSize)} fullWidth>
          Show more ({metrics.length - count} remaining)
        </Button>
      )}
    </div>
  );
}
