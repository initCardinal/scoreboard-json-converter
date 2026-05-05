# Scoreboard JSON Converter

Converts a clinic performance scoreboard Excel file into structured, queryable JSON. Comes with an optional local dashboard for exploring the output interactively.

---

## What it does

The spreadsheet is treated as both a source document and a data source. The converter produces JSON with two distinct layers:

- **Preservation layer** (`raw_cells`, `columns`, `merged_ranges`) captures the workbook faithfully, including blank cells, hidden columns, spacer columns, and formula strings alongside their cached values.
- **Scoreboard layer** (`scoreboard.metrics`, `scoreboard.records`, `scoreboard.formula_audit`) is normalized and queryable. Metrics get stable IDs. Records are indexed by date row. Formulas are flagged and auditable.

---

## Requirements

- Python 3.9+
- openpyxl 3.1.5

---

## Running the converter

```bash
cd scoreboard-json-converter
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python convert.py
```

With explicit paths:

```bash
python convert.py --input "Scoreboard Test.xlsx" --output output.json
```

The script prints a summary after writing:

```
Wrote: output.json
  Sheet         : SCOREBOARD
  Dimensions    : A1:EL10
  Total columns : 142
  Metrics       : 97
  Date rows     : 3
  Formulas      : 22
  Formula errors: 0
  Hidden columns: 42
  Spacer columns: 15
  Merged ranges : 1
```

---

## Running the dashboard (optional)

Requires Node.js 18+.

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000.

The dashboard reads `output.json` from the project root. Run the converter first, or use the Run Converter button inside the dashboard.

---

## JSON shape

### Why this shape

A raw dump of the spreadsheet (row arrays with positional values) is technically lossless but unusable. A developer or LLM trying to answer "what was the answer rate on 2026-02-16" should not have to know that column AK is index 37. The JSON separates concern:

- The raw layer is there if you need to audit the source or reconstruct the original.
- The scoreboard layer is there if you want to query, chart, or feed data into another system.

### Top-level structure

```json
{
  "meta": {
    "source_file": "Scoreboard Test.xlsx",
    "generated_at": "2026-05-04T12:00:00Z",
    "converter_version": "1.0.0",
    "warnings": []
  },
  "workbook": {
    "sheet_count": 1,
    "sheets": ["SCOREBOARD"]
  },
  "sheets": [ ... ]
}
```

### Sheet structure (abbreviated)

```json
{
  "name": "SCOREBOARD",
  "dimensions": { "min_row": 1, "max_row": 10, "min_column": 1, "max_column": 142, "range": "A1:EL10" },
  "merged_ranges": [
    { "range": "AJ1:AP1", "value": "PHONE PERFORMANCE", "start_cell": "AJ1", "end_cell": "AP1" }
  ],
  "columns": [
    { "index": 1, "letter": "A", "hidden": false, "width": 14.63, "is_spacer": false }
  ],
  "raw_cells": {
    "B8": {
      "coordinate": "B8", "row": 8, "column": 2, "column_letter": "B",
      "value": 40454.28, "formula": null, "cached_value": 40454.28,
      "data_type": "n", "number_format": "\"$\"#,##0", "is_merged": false, "merged_parent": null
    }
  },
  "scoreboard": {
    "header_rows": { "section": 1, "metric": 2, "focus": 3, "source": 4, "role": 5, "target_label": 6, "target_value": 7 },
    "date_rows": [8, 9, 10],
    "metrics": [
      {
        "id": "b_total_revenue_all_services",
        "column": "B", "column_index": 2,
        "heading": "Total Revenue - All Services",
        "section": null,
        "focus": "Financial",
        "source": "EMR",
        "role": "J",
        "target": { "label": "Target", "value": null },
        "hidden": false,
        "number_format": "\"$\"#,##0"
      }
    ],
    "records": [
      {
        "row": 8,
        "date": "2026-02-16",
        "values": {
          "b_total_revenue_all_services": {
            "cell": "B8", "value": 40454.28, "formula": null,
            "cached_value": 40454.28, "number_format": "\"$\"#,##0", "has_error": false
          }
        }
      }
    ],
    "formula_audit": [
      {
        "cell": "I8", "metric_id": "i_revenue_collected_4_wk_avg",
        "formula": "=if(B8=\"\",\"Formula\",sum(H8:H10)/sum(B8:B10))",
        "cached_value": 1.00441053, "has_error": false
      }
    ]
  }
}
```

---

## Decisions and trade-offs

### Merged cells

Merged ranges are captured in `merged_ranges`. The section label (row 1) from each merge is propagated to every column within that range as `section` on the metric definition. Only one merge exists in this workbook: `AJ1:AP1` = "PHONE PERFORMANCE". Columns outside any merge get `section: null`.

### Spacer columns

A column is a spacer if every cell across all rows is blank. Spacers are flagged with `is_spacer: true` in the `columns` array and are excluded from `scoreboard.metrics`. They are preserved in `raw_cells` and `columns` because removing them would change the column index mapping and break any coordinate-based reference.

### Hidden columns

Hidden columns are fully preserved in `columns`, `raw_cells`, `scoreboard.metrics`, and `scoreboard.records`. They are marked `hidden: true`. Skipping them would silently lose data the spreadsheet owner chose to hide rather than delete.

### Formulas

The workbook is loaded twice. The formula workbook preserves the original formula string (`=IF(...)`). The data-only workbook provides the last cached value Excel computed. Both are written to every cell. Formulas are never recalculated because recalculation requires a full Excel engine and may produce different results from what the file actually stored.

### Formula errors

If a cached value is an Excel error string (`#REF!`, `#DIV/0!`, `#VALUE!`, etc.), it is preserved as a string and `has_error` is set to `true`. The converter does not crash on errors and does not remove them.

### Blank cells

Blank cells are represented as `null`. They are not omitted. A missing key and a null value mean different things to a downstream consumer.

### Metric IDs

IDs are built as `{lowercase_column_letter}_{slugified_heading}`. The column letter prefix guarantees uniqueness even when two columns share the same heading. Example: `b_total_revenue_all_services`, `aj_total_calls`.

### Dates

Excel stores dates as serial numbers internally. The converter resolves them to ISO date strings (`2026-02-16`) using the standard Excel epoch (1899-12-30).

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| openpyxl over pandas | Direct cell-level access, preserves formulas, hidden columns, number formats. Pandas reads values only and loses structure. |
| Two workbook passes | Doubles load time. Necessary to get both formula strings and cached values. |
| Flat raw_cells dict | Slightly larger JSON than a nested row/col structure, but O(1) lookup by coordinate. |
| Column-letter-prefixed IDs | IDs look verbose but are stable. A pure slug would collide on duplicate headings. |

---

## With more time

- Automated tests for workbook parsing
- Snapshot tests for output.json
- Optional formula recalculation through LibreOffice
- Export to flattened CSV alongside JSON
- More chart presets in the dashboard
- A JSON schema file for validating output
- Drag and drop upload support for other workbooks
- Docker setup for a consistent reviewer environment
