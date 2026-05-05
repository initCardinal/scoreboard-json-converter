"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricDefinition, FlatRecord } from "@/lib/scoreboard-types";
import { getNumericValue } from "@/lib/aggregate";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectField } from "@/components/ui/Field";

interface Props {
  metrics: MetricDefinition[];
  flatRows: FlatRecord[];
}

export function MetricChart({ metrics, flatRows }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (selectedId) return;
    for (const m of metrics) {
      const rows = flatRows.filter((r) => r.metric_id === m.id);
      if (rows.some((r) => getNumericValue(r.value) !== null)) {
        setSelectedId(m.id);
        return;
      }
    }
  }, [metrics, flatRows, selectedId]);

  const chartData = useMemo(() => {
    if (!selectedId) return [];
    return flatRows
      .filter((r) => r.metric_id === selectedId && r.date !== null)
      .map((r) => ({ date: r.date ?? "", value: getNumericValue(r.value) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedId, flatRows]);

  const selected = metrics.find((m) => m.id === selectedId);
  const hasData = chartData.some((d) => d.value !== null);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
        <SelectField
          label="Metric"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          options={metrics.map((m) => m.id)}
          placeholder="Pick a metric"
          fullWidth
        />
        {selected && (
          <p className="text-xs text-gray-500 sm:pb-2 truncate">
            {selected.heading} {selected.focus ? `| ${selected.focus}` : ""}
            {selected.source ? ` | ${selected.source}` : ""}
          </p>
        )}
      </div>

      {!selectedId && (
        <EmptyState title="Select a metric" description="Pick a metric to chart its values over time." />
      )}

      {selectedId && !hasData && (
        <EmptyState
          title="No numeric values"
          description="This metric has no numeric values to chart."
        />
      )}

      {selectedId && hasData && (
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 12, left: -12, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={70} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderColor: "#e5e7eb" }}
                formatter={(v) =>
                  v !== null && v !== undefined ? Number(v).toLocaleString() : "null"
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#374151"
                strokeWidth={2}
                dot={{ r: 4, fill: "#374151" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
