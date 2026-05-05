import { ScoreboardOutput, FlatRecord } from "./scoreboard-types";

export function flattenRecords(output: ScoreboardOutput): FlatRecord[] {
  const sheet = output.sheets[0];
  if (!sheet) return [];

  const { metrics, records } = sheet.scoreboard;
  const metricMap = new Map(metrics.map((m) => [m.id, m]));

  const flat: FlatRecord[] = [];

  for (const record of records) {
    for (const [metricId, mv] of Object.entries(record.values)) {
      const metric = metricMap.get(metricId);
      if (!metric) continue;
      flat.push({
        date: record.date,
        row: record.row,
        metric_id: metricId,
        heading: metric.heading,
        section: metric.section,
        focus: metric.focus,
        source: metric.source,
        role: metric.role,
        cell: mv.cell,
        value: mv.value,
        formula: mv.formula,
        cached_value: mv.cached_value,
        has_error: mv.has_error,
        has_formula: mv.formula !== null,
      });
    }
  }

  return flat;
}

export function getNumericValue(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return isFinite(n) ? n : null;
}

type GroupKey = "date" | "section" | "focus" | "source" | "role";
type AggType = "sum" | "average" | "min" | "max" | "count";

export interface AggRow {
  group: string | null;
  value: number | null;
  count: number;
}

export function aggregateRows(
  rows: FlatRecord[],
  groupBy: GroupKey,
  aggregation: AggType,
  metricId: string
): AggRow[] {
  const filtered = rows.filter((r) => r.metric_id === metricId);
  if (filtered.length === 0) return [];

  const groups = new Map<string | null, number[]>();

  for (const row of filtered) {
    const key = (row[groupBy] as string | null) ?? null;
    const numeric = getNumericValue(row.value);
    if (!groups.has(key)) groups.set(key, []);
    if (numeric !== null) {
      groups.get(key)!.push(numeric);
    }
  }

  const result: AggRow[] = [];

  for (const [group, values] of groups.entries()) {
    if (aggregation === "count") {
      result.push({ group, value: values.length, count: values.length });
      continue;
    }
    if (values.length === 0) {
      result.push({ group, value: null, count: 0 });
      continue;
    }
    let agg: number | null = null;
    if (aggregation === "sum") agg = values.reduce((a, b) => a + b, 0);
    else if (aggregation === "average") agg = values.reduce((a, b) => a + b, 0) / values.length;
    else if (aggregation === "min") agg = Math.min(...values);
    else if (aggregation === "max") agg = Math.max(...values);
    result.push({ group, value: agg, count: values.length });
  }

  return result.sort((a, b) => {
    if (a.group === null) return 1;
    if (b.group === null) return -1;
    return a.group.localeCompare(b.group);
  });
}

export function getUniqueFilterValues(rows: FlatRecord[], key: keyof FlatRecord): string[] {
  const seen = new Set<string>();
  for (const row of rows) {
    const v = row[key];
    if (v !== null && v !== undefined && v !== "") seen.add(String(v));
  }
  return Array.from(seen).sort();
}
