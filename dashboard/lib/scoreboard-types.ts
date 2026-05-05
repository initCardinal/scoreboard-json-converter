export interface ScoreboardOutput {
  meta: WorkbookMeta;
  workbook: {
    sheet_count: number;
    sheets: string[];
  };
  sheets: SheetOutput[];
}

export interface WorkbookMeta {
  source_file: string;
  generated_at: string;
  converter_version: string;
  warnings: string[];
}

export interface SheetOutput {
  name: string;
  dimensions: {
    min_row: number;
    max_row: number;
    min_column: number;
    max_column: number;
    range: string;
  };
  merged_ranges: MergedRange[];
  columns: ColumnMeta[];
  raw_cells: Record<string, RawCell>;
  scoreboard: ScoreboardLayer;
}

export interface MergedRange {
  range: string;
  value: string | null;
  start_cell: string;
  end_cell: string;
}

export interface ColumnMeta {
  index: number;
  letter: string;
  hidden: boolean;
  width: number | null;
  is_spacer: boolean;
}

export interface RawCell {
  coordinate: string;
  row: number;
  column: number;
  column_letter: string;
  value: string | number | boolean | null;
  formula: string | null;
  cached_value: string | number | boolean | null;
  data_type: string;
  number_format: string;
  is_merged: boolean;
  merged_parent: string | null;
}

export interface ScoreboardLayer {
  header_rows: {
    section: number;
    metric: number;
    focus: number;
    source: number;
    role: number;
    target_label: number;
    target_value: number;
  };
  date_rows: number[];
  metrics: MetricDefinition[];
  records: ScoreboardRecord[];
  formula_audit: FormulaAuditItem[];
}

export interface MetricDefinition {
  id: string;
  column: string;
  column_index: number;
  heading: string;
  section: string | null;
  focus: string | null;
  source: string | null;
  role: string | null;
  target: {
    label: string | null;
    value: string | number | null;
  };
  hidden: boolean;
  number_format: string;
}

export interface ScoreboardRecord {
  row: number;
  date: string | null;
  values: Record<string, MetricValue>;
}

export interface MetricValue {
  cell: string;
  value: string | number | boolean | null;
  formula: string | null;
  cached_value: string | number | boolean | null;
  number_format: string;
  has_error: boolean;
}

export interface FormulaAuditItem {
  cell: string;
  metric_id: string | null;
  formula: string;
  cached_value: string | number | boolean | null;
  has_error: boolean;
}

// Flattened row used in RecordsTable and aggregation
export interface FlatRecord {
  date: string | null;
  row: number;
  metric_id: string;
  heading: string;
  section: string | null;
  focus: string | null;
  source: string | null;
  role: string | null;
  cell: string;
  value: string | number | boolean | null;
  formula: string | null;
  cached_value: string | number | boolean | null;
  has_error: boolean;
  has_formula: boolean;
}
