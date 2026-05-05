"use client";

import { useMemo } from "react";
import { FlatRecord, MetricDefinition } from "@/lib/scoreboard-types";
import { RecordFilters } from "@/lib/filters";
import { getUniqueFilterValues } from "@/lib/aggregate";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { SelectField, CheckboxField } from "@/components/ui/Field";

interface Props {
  rows: FlatRecord[];
  metrics: MetricDefinition[];
  filters: RecordFilters;
  onChange: (next: RecordFilters) => void;
}

export function RecordsFilters({ rows, metrics, filters, onChange }: Props) {
  const dates = useMemo(() => getUniqueFilterValues(rows, "date"), [rows]);
  const focuses = useMemo(() => getUniqueFilterValues(rows, "focus"), [rows]);
  const sources = useMemo(() => getUniqueFilterValues(rows, "source"), [rows]);

  const set =
    <K extends keyof RecordFilters>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      onChange({ ...filters, [key]: value as RecordFilters[K] });
    };

  return (
    <CollapsiblePanel label="Filters" defaultOpen>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SelectField label="Date" value={filters.date} onChange={set("date")} options={dates} fullWidth />
        <SelectField
          label="Metric"
          value={filters.metric}
          onChange={set("metric")}
          options={metrics.map((m) => m.id)}
          fullWidth
        />
        <SelectField label="Focus" value={filters.focus} onChange={set("focus")} options={focuses} fullWidth />
        <SelectField label="Source" value={filters.source} onChange={set("source")} options={sources} fullWidth />
        <div className="flex items-end gap-4">
          <CheckboxField label="Formula only" checked={filters.formulaOnly} onChange={set("formulaOnly")} />
          <CheckboxField label="Errors only" checked={filters.errorsOnly} onChange={set("errorsOnly")} />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
