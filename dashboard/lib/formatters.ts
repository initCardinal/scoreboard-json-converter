export function formatValue(
  value: string | number | boolean | null | undefined,
  numberFormat?: string
): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") {
    // Currency hint
    if (numberFormat && (numberFormat.includes("$") || numberFormat.includes("\"$\""))) {
      return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 2 }).format(value);
    }
    // Percentage hint
    if (numberFormat && numberFormat.includes("%")) {
      return (value * 100).toFixed(1) + "%";
    }
    // Large integers
    if (Number.isInteger(value)) return value.toLocaleString();
    // Decimals
    return value.toFixed(4).replace(/\.?0+$/, "");
  }
  return String(value);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  // Dates arrive as ISO strings like 2026-02-16
  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  return `${y}-${m}-${d}`;
}

export function shortenFormula(formula: string | null, maxLen = 40): string {
  if (!formula) return "";
  return formula.length > maxLen ? formula.slice(0, maxLen) + "..." : formula;
}
