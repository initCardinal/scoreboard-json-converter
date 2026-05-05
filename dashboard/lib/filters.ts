import { FlatRecord, MetricDefinition } from "./scoreboard-types";

export interface MetricFilters {
  search: string;
  section: string;
  focus: string;
  source: string;
  role: string;
  showHidden: boolean;
}

export function filterMetrics(
  metrics: MetricDefinition[],
  filters: MetricFilters
): MetricDefinition[] {
  return metrics.filter((m) => {
    if (!filters.showHidden && m.hidden) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!m.heading.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q)) return false;
    }

    if (filters.section && m.section !== filters.section) return false;
    if (filters.focus && m.focus !== filters.focus) return false;
    if (filters.source && m.source !== filters.source) return false;
    if (filters.role && m.role !== filters.role) return false;

    return true;
  });
}

export interface RecordFilters {
  date: string;
  metric: string;
  focus: string;
  source: string;
  formulaOnly: boolean;
  errorsOnly: boolean;
}

export function filterFlatRecords(
  rows: FlatRecord[],
  filters: RecordFilters
): FlatRecord[] {
  return rows.filter((r) => {
    if (filters.date && r.date !== filters.date) return false;
    if (filters.metric && r.metric_id !== filters.metric) return false;
    if (filters.focus && r.focus !== filters.focus) return false;
    if (filters.source && r.source !== filters.source) return false;
    if (filters.formulaOnly && !r.has_formula) return false;
    if (filters.errorsOnly && !r.has_error) return false;
    return true;
  });
}
