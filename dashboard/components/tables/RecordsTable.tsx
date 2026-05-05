"use client";

import { useMemo, useState } from "react";
import { FlatRecord, MetricDefinition } from "@/lib/scoreboard-types";
import { filterFlatRecords, RecordFilters } from "@/lib/filters";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips, ActiveFilter } from "@/components/ui/FilterChips";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { RecordsFilters } from "./RecordsFilters";
import { RecordsTableDesktop } from "./RecordsTableDesktop";
import { RecordsTableMobile } from "./RecordsTableMobile";

const EMPTY: RecordFilters = {
  date: "",
  metric: "",
  focus: "",
  source: "",
  formulaOnly: false,
  errorsOnly: false,
};

interface Props {
  flatRows: FlatRecord[];
  metrics: MetricDefinition[];
}

export function RecordsTable({ flatRows, metrics }: Props) {
  const [filters, setFilters] = useState<RecordFilters>(EMPTY);
  const isDesktop = useIsDesktop();
  const filtered = useMemo(() => filterFlatRecords(flatRows, filters), [flatRows, filters]);

  const chips: ActiveFilter[] = [];
  if (filters.date) chips.push({ key: "date", label: "Date", value: filters.date, onClear: () => setFilters({ ...filters, date: "" }) });
  if (filters.metric) chips.push({ key: "metric", label: "Metric", value: filters.metric, onClear: () => setFilters({ ...filters, metric: "" }) });
  if (filters.focus) chips.push({ key: "focus", label: "Focus", value: filters.focus, onClear: () => setFilters({ ...filters, focus: "" }) });
  if (filters.source) chips.push({ key: "source", label: "Source", value: filters.source, onClear: () => setFilters({ ...filters, source: "" }) });
  if (filters.formulaOnly) chips.push({ key: "fx", label: "Formula only", value: "yes", onClear: () => setFilters({ ...filters, formulaOnly: false }) });
  if (filters.errorsOnly) chips.push({ key: "err", label: "Errors only", value: "yes", onClear: () => setFilters({ ...filters, errorsOnly: false }) });

  return (
    <div className="space-y-3">
      <RecordsFilters rows={flatRows} metrics={metrics} filters={filters} onChange={setFilters} />

      <div className="flex flex-wrap items-center gap-3">
        <FilterChips filters={chips} onClearAll={() => setFilters(EMPTY)} />
        <span className="ml-auto text-xs text-gray-500">
          {filtered.length} row{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No records match your filters"
            description="Try clearing one or more filters to see more results."
          />
        </Card>
      ) : isDesktop ? (
        <Card padded={false} className="overflow-hidden">
          <RecordsTableDesktop rows={filtered} />
        </Card>
      ) : (
        <RecordsTableMobile rows={filtered} />
      )}
    </div>
  );
}
