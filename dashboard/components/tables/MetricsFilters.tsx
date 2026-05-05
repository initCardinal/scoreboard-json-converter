"use client";

import { useMemo } from "react";
import { MetricDefinition } from "@/lib/scoreboard-types";
import { MetricFilters } from "@/lib/filters";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { SelectField, TextField, CheckboxField } from "@/components/ui/Field";

interface Props {
  metrics: MetricDefinition[];
  filters: MetricFilters;
  onChange: (next: MetricFilters) => void;
}

function unique(values: (string | null)[]) {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
}

export function MetricsFilters({ metrics, filters, onChange }: Props) {
  const sections = useMemo(() => unique(metrics.map((m) => m.section)), [metrics]);
  const focuses = useMemo(() => unique(metrics.map((m) => m.focus)), [metrics]);
  const sources = useMemo(() => unique(metrics.map((m) => m.source)), [metrics]);
  const roles = useMemo(() => unique(metrics.map((m) => m.role)), [metrics]);

  const set =
    <K extends keyof MetricFilters>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      onChange({ ...filters, [key]: value as MetricFilters[K] });
    };

  return (
    <CollapsiblePanel label="Filters" defaultOpen>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <TextField
          label="Search heading or ID"
          placeholder="e.g. revenue"
          value={filters.search}
          onChange={set("search")}
          fullWidth
        />
        <SelectField label="Section" value={filters.section} onChange={set("section")} options={sections} fullWidth />
        <SelectField label="Focus" value={filters.focus} onChange={set("focus")} options={focuses} fullWidth />
        <SelectField label="Source" value={filters.source} onChange={set("source")} options={sources} fullWidth />
        <SelectField label="Role" value={filters.role} onChange={set("role")} options={roles} fullWidth />
        <div className="flex items-end">
          <CheckboxField
            label="Show hidden columns"
            checked={filters.showHidden}
            onChange={set("showHidden")}
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
