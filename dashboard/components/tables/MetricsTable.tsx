"use client";

import { useMemo, useState } from "react";
import { MetricDefinition } from "@/lib/scoreboard-types";
import { filterMetrics, MetricFilters } from "@/lib/filters";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips, ActiveFilter } from "@/components/ui/FilterChips";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { MetricsFilters } from "./MetricsFilters";
import { MetricsTableDesktop } from "./MetricsTableDesktop";
import { MetricsTableMobile } from "./MetricsTableMobile";

const EMPTY: MetricFilters = {
  search: "",
  section: "",
  focus: "",
  source: "",
  role: "",
  showHidden: true,
};

interface Props {
  metrics: MetricDefinition[];
}

export function MetricsTable({ metrics }: Props) {
  const [filters, setFilters] = useState<MetricFilters>(EMPTY);
  const isDesktop = useIsDesktop();

  const filtered = useMemo(() => filterMetrics(metrics, filters), [metrics, filters]);

  const chips: ActiveFilter[] = [];
  if (filters.search) chips.push({ key: "search", label: "Search", value: filters.search, onClear: () => setFilters({ ...filters, search: "" }) });
  if (filters.section) chips.push({ key: "section", label: "Section", value: filters.section, onClear: () => setFilters({ ...filters, section: "" }) });
  if (filters.focus) chips.push({ key: "focus", label: "Focus", value: filters.focus, onClear: () => setFilters({ ...filters, focus: "" }) });
  if (filters.source) chips.push({ key: "source", label: "Source", value: filters.source, onClear: () => setFilters({ ...filters, source: "" }) });
  if (filters.role) chips.push({ key: "role", label: "Role", value: filters.role, onClear: () => setFilters({ ...filters, role: "" }) });
  if (!filters.showHidden) chips.push({ key: "hidden", label: "Hidden", value: "off", onClear: () => setFilters({ ...filters, showHidden: true }) });

  return (
    <div className="space-y-3">
      <MetricsFilters metrics={metrics} filters={filters} onChange={setFilters} />

      <div className="flex flex-wrap items-center gap-3">
        <FilterChips filters={chips} onClearAll={() => setFilters(EMPTY)} />
        <span className="ml-auto text-xs text-gray-500">
          {filtered.length} of {metrics.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No metrics match your filters"
            description="Try clearing one or more filters to see more results."
          />
        </Card>
      ) : isDesktop ? (
        <Card padded={false} className="overflow-hidden">
          <MetricsTableDesktop metrics={filtered} />
        </Card>
      ) : (
        <MetricsTableMobile metrics={filtered} />
      )}
    </div>
  );
}
