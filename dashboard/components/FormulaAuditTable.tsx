"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { FormulaAuditItem } from "@/lib/scoreboard-types";
import { formatValue } from "@/lib/formatters";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckboxField } from "@/components/ui/Field";
import { MobileDataCard } from "@/components/ui/MobileDataCard";
import { useIsDesktop } from "@/hooks/useMediaQuery";

interface Props {
  audit: FormulaAuditItem[];
}

export function FormulaAuditTable({ audit }: Props) {
  const [errorsOnly, setErrorsOnly] = useState(false);
  const isDesktop = useIsDesktop();

  const filtered = useMemo(
    () => (errorsOnly ? audit.filter((a) => a.has_error) : audit),
    [audit, errorsOnly]
  );
  const errorCount = audit.filter((a) => a.has_error).length;

  return (
    <div className="space-y-3">
      <Card className="flex flex-wrap items-center gap-4">
        <CheckboxField
          label="Errors only"
          checked={errorsOnly}
          onChange={(e) => setErrorsOnly(e.target.checked)}
        />
        <span className="ml-auto text-xs text-gray-500">
          {audit.length} formula{audit.length !== 1 ? "s" : ""}
          {errorCount > 0 && ` | ${errorCount} error${errorCount !== 1 ? "s" : ""}`}
        </span>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title={errorsOnly ? "No formula errors found" : "No formulas found"} />
        </Card>
      ) : isDesktop ? (
        <Card padded={false} className="overflow-hidden">
          <FormulaTable items={filtered} />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <MobileDataCard
              key={a.cell}
              title={<code className="font-mono">{a.cell}</code>}
              subtitle={a.metric_id ?? undefined}
              badges={a.has_error ? <ErrorBadge /> : undefined}
              rows={[
                {
                  label: "Cached",
                  mono: true,
                  value:
                    a.cached_value !== null ? (
                      <span className={a.has_error ? "text-red-700 font-semibold" : ""}>
                        {formatValue(a.cached_value)}
                      </span>
                    ) : null,
                },
              ]}
              formula={a.formula}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ErrorBadge() {
  return (
    <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded">error</span>
  );
}

function FormulaTable({ items }: { items: FormulaAuditItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            {["Cell", "Metric", "Formula", "Cached Value", "Error"].map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((a) => (
            <tr key={a.cell} className={clsx(a.has_error ? "bg-red-50" : "hover:bg-gray-50")}>
              <td className="px-3 py-2 font-mono text-xs text-gray-600">{a.cell}</td>
              <td className="px-3 py-2 font-mono text-xs text-gray-500 break-all max-w-[200px]">{a.metric_id ?? ""}</td>
              <td className="px-3 py-2 font-mono text-xs max-w-md truncate" title={a.formula}>
                {a.formula}
              </td>
              <td className={clsx("px-3 py-2 font-mono text-xs", a.has_error && "text-red-700 font-semibold")}>
                {a.cached_value !== null ? formatValue(a.cached_value) : <span className="text-gray-300">null</span>}
              </td>
              <td className="px-3 py-2">{a.has_error && <ErrorBadge />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
