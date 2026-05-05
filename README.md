# Scoreboard JSON Converter

Converts a clinic performance scoreboard Excel file into structured, queryable JSON.

The project also includes an optional local dashboard for reviewing the generated JSON, checking metrics, and downloading the output once it has been loaded.

---

## What it does

The spreadsheet is treated as both a source document and a data source.

The converter generates a dual-layer JSON output:

1. **Raw workbook layer**
   - Preserves the workbook as honestly as possible
   - Keeps raw cells, columns, merged ranges, hidden columns, blank cells, formulas, and cached values
   - Useful for audit, debugging, and reconstruction

2. **Normalized scoreboard layer**
   - Turns the scoreboard into usable structured data
   - Provides stable metrics, date-based records, and formula audit data
   - Useful for querying, filtering, charting, and feeding into another system

---

## Requirements

- Python 3.9+
- openpyxl 3.1.5
- Node.js 18+ if using the optional dashboard

---

## Running the converter

From the project root:

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

The converter writes `output.json` and prints a summary:

```text
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

From the dashboard folder:

```bash
cd dashboard
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The dashboard reads `output.json` from the project root.

### Dashboard behaviour

The dashboard does not display data automatically on page load.

Data must be loaded manually using one of the dashboard actions.

### Dashboard actions

#### Run Converter

Use this when you want to generate a fresh JSON file.

This action:

- Runs `convert.py`
- Generates a new `output.json`
- Loads the generated data into the dashboard

#### Refresh Output

Use this when `output.json` already exists and you only want to reload it.

This action:

- Reads the existing `output.json`
- Loads the data into the dashboard
- Does not run `convert.py`

#### Download JSON

Use this after data has been loaded in the current dashboard session.

This action:

- Downloads the currently loaded JSON
- Is only available after dashboard data has been loaded in the current session

---

## JSON shape

### Dual-layer JSON shape

The output uses a dual-layer JSON shape.

It has two clear layers:

1. **Raw workbook layer**
2. **Normalized scoreboard layer**

```json
{
  "meta": {},
  "workbook": {},
  "sheets": [
    {
      "raw_cells": {},
      "scoreboard": {
        "metrics": [],
        "records": [],
        "formula_audit": []
      }
    }
  ]
}
```

### Why this shape

A raw dump of the spreadsheet is not enough.

It may preserve values, but it forces another developer or LLM to understand column positions before they can ask useful questions.

For example, someone should be able to ask:

```text
What was the answer rate on 2026-02-16?
```

They should not need to know which spreadsheet column contains that value first.

This project uses a dual-layer JSON shape so the original workbook remains auditable while the scoreboard data is still easy to use.

### Raw workbook layer

The raw workbook layer preserves the spreadsheet honestly.

It keeps the source structure intact for audit, debugging, and reconstruction.

This includes:

- Raw cell coordinates
- Original values
- Cached formula values
- Formula strings
- Blank cells
- Hidden columns
- Spacer columns
- Merged ranges
- Column metadata
- Number formats

This layer is useful when you need to check what was actually in the workbook.

### Normalized scoreboard layer

The normalized scoreboard layer makes the spreadsheet easier to work with.

It turns the scoreboard into structured data with:

- Stable metric IDs
- Metric definitions
- Date-based records
- Values mapped by metric ID
- Formula audit entries

This layer is useful when you want to:

- Query the data
- Filter by date
- Chart performance
- Compare metrics
- Feed the output into another system
- Let another developer or LLM understand the data without relying on column positions

---

## Top-level structure

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
  "sheets": []
}
```

---

## Sheet structure

This is a shortened example of one parsed sheet.

```json
{
  "name": "SCOREBOARD",
  "dimensions": {
    "min_row": 1,
    "max_row": 10,
    "min_column": 1,
    "max_column": 142,
    "range": "A1:EL10"
  },
  "merged_ranges": [
    {
      "range": "AJ1:AP1",
      "value": "PHONE PERFORMANCE",
      "start_cell": "AJ1",
      "end_cell": "AP1"
    }
  ],
  "columns": [
    {
      "index": 1,
      "letter": "A",
      "hidden": false,
      "width": 14.63,
      "is_spacer": false
    }
  ],
  "raw_cells": {
    "B8": {
      "coordinate": "B8",
      "row": 8,
      "column": 2,
      "column_letter": "B",
      "value": 40454.28,
      "formula": null,
      "cached_value": 40454.28,
      "data_type": "n",
      "number_format": "\"$\"#,##0",
      "is_merged": false,
      "merged_parent": null
    }
  },
  "scoreboard": {
    "header_rows": {
      "section": 1,
      "metric": 2,
      "focus": 3,
      "source": 4,
      "role": 5,
      "target_label": 6,
      "target_value": 7
    },
    "date_rows": [8, 9, 10],
    "metrics": [
      {
        "id": "b_total_revenue_all_services",
        "column": "B",
        "column_index": 2,
        "heading": "Total Revenue - All Services",
        "section": null,
        "focus": "Financial",
        "source": "EMR",
        "role": "J",
        "target": {
          "label": "Target",
          "value": null
        },
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
            "cell": "B8",
            "value": 40454.28,
            "formula": null,
            "cached_value": 40454.28,
            "number_format": "\"$\"#,##0",
            "has_error": false
          }
        }
      }
    ],
    "formula_audit": [
      {
        "cell": "I8",
        "metric_id": "i_revenue_collected_4_wk_avg",
        "formula": "=if(B8=\"\",\"Formula\",sum(H8:H10)/sum(B8:B10))",
        "cached_value": 1.00441053,
        "has_error": false
      }
    ]
  }
}
```

---

## Key decisions

### Merged cells

Merged ranges are captured in `merged_ranges`.

The section label from row 1 is applied to every metric inside that merged range.

Example:

```text
AJ1:AP1 = PHONE PERFORMANCE
```

Columns outside a merged section use:

```json
"section": null
```

### Spacer columns

A spacer column is a column where every cell is blank.

Spacer columns are:

- Marked as `is_spacer: true`
- Preserved in `columns`
- Preserved in `raw_cells`
- Excluded from `scoreboard.metrics`

They are not removed because removing them would change the original column mapping.

### Hidden columns

Hidden columns are preserved.

They appear in:

- `columns`
- `raw_cells`
- `scoreboard.metrics`
- `scoreboard.records`

They are marked with:

```json
"hidden": true
```

Hidden does not mean unused. It only means the spreadsheet owner hid the column.

### Formulas

The workbook is loaded twice.

One pass keeps the original formula strings.

One pass reads the cached values stored by Excel.

Both are written to the JSON output.

Formulas are not recalculated by the converter. Recalculation would require a full Excel engine and could produce values that differ from the workbook's saved state.

### Formula errors

Excel errors are preserved as values.

Examples include:

- `#REF!`
- `#DIV/0!`
- `#VALUE!`

When a formula error is found, the entry is marked with:

```json
"has_error": true
```

The converter does not crash because of formula errors.

### Blank cells

Blank cells are written as:

```json
null
```

They are not skipped.

A missing value and a blank spreadsheet cell are not the same thing, so blank cells stay visible in the raw layer.

### Metric IDs

Metric IDs are built from the column letter and the metric heading.

Format:

```text
{lowercase_column_letter}_{slugified_heading}
```

Example:

```text
b_total_revenue_all_services
aj_total_calls
```

The column letter keeps IDs stable and prevents duplicate heading conflicts.

### Dates

Excel stores dates as serial numbers.

The converter resolves date rows to ISO date strings.

Example:

```text
2026-02-16
```

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| `openpyxl` over `pandas` | Better access to formulas, hidden columns, merged cells, number formats, and cell-level structure. |
| Two workbook passes | Slower than one pass, but needed to capture both formula strings and cached values. |
| Flat `raw_cells` object | Larger JSON, but fast lookup by cell coordinate. |
| Column-letter metric IDs | IDs are longer, but stable and safer when headings repeat. |
| Preserve hidden columns | Output includes more data, but avoids silently losing workbook information. |
| Preserve blank cells | Output is larger, but keeps the workbook structure honest. |

---

## With more time

- Add automated tests for workbook parsing
- Add snapshot tests for `output.json`
- Add an optional JSON schema file
- Add optional CSV export
- Add more dashboard chart presets
- Add drag and drop workbook upload support
- Add Docker setup for a consistent review environment
- Add optional formula recalculation through LibreOffice
