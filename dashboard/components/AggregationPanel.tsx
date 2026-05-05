"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlatRecord, MetricDefinition } from "@/lib/scoreboard-types";
import { aggregateRows, AggRow } from "@/lib/aggregate";
import { formatValue } from "@/lib/formatters";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectField } from "@/components/ui/Field";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface Props {
  flatRows: FlatRecord[];
  metrics: MetricDefinition[];
}

type GroupBy = "date" | "section" | "focus" | "source" | "role";
type AggType = "sum" | "average" | "min" | "max" | "count";

const GROUPS: GroupBy[] = ["date", "section", "focus", "source", "role"];
const AGGS: AggType[] = ["sum", "average", "min", "max", "count"];

export function AggregationPanel({ flatRows, metrics }: Props) {
  const reduce = useReducedMotionSafe();
  const [metricId, setMetricId] = useState(metrics[0]?.id ?? "");
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [aggregation, setAggregation] = useState<AggType>("sum");

  useEffect(() => {
    if (!metricId && metrics.length > 0) setMetricId(metrics[0].id);
  }, [metrics, metricId]);

  const results: AggRow[] = useMemo(() => {
    if (!metricId) return [];
    return aggregateRows(flatRows, groupBy, aggregation, metricId);
  }, [flatRows, groupBy, aggregation, metricId]);

  return (
    <Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <SelectField
          label="Metric"
          value={metricId}
          onChange={(e) => setMetricId(e.target.value)}
          options={metrics.map((m) => m.id)}
          placeholder="Pick a metric"
          fullWidth
        />
        <SelectField
          label="Group by"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupBy)}
          options={GROUPS}
          fullWidth
        />
        <SelectField
          label="Aggregation"
          value={aggregation}
          onChange={(e) => setAggregation(e.target.value as AggType)}
          options={AGGS}
          fullWidth
        />
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Only numeric values are aggregated. Nulls are ignored for sum and average.
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Nothing to aggregate"
          description="This metric has no numeric values for the chosen group."
        />
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${metricId}-${groupBy}-${aggregation}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto -mx-1"
          >
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-1 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide capitalize">
                    {groupBy}
                  </th>
                  <th className="px-1 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide capitalize">
                    {aggregation}
                  </th>
                  <th className="px-1 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    n
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((r) => (
                  <tr key={r.group ?? "__null__"}>
                    <td className="px-1 py-2 font-mono text-xs">
                      {r.group ?? <span className="text-gray-400">null</span>}
                    </td>
                    <td className="px-1 py-2 text-right font-mono text-xs">
                      {r.value !== null ? formatValue(r.value) : <span className="text-gray-400">null</span>}
                    </td>
                    <td className="px-1 py-2 text-right text-xs text-gray-400">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  );
}
