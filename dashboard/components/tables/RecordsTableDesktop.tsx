"use client";

import clsx from "clsx";
import { FlatRecord } from "@/lib/scoreboard-types";
import { formatValue } from "@/lib/formatters";

interface Props {
  rows: FlatRecord[];
}

export function RecordsTableDesktop({ rows }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            {["Date", "Metric", "Section", "Focus", "Source", "Role", "Value", "Cell", "Flags"].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={`${r.row}-${r.metric_id}-${i}`} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{r.date ?? ""}</td>
              <td
                className="px-3 py-2 text-xs text-gray-700 max-w-[220px] truncate"
                title={r.heading}
              >
                {r.heading}
              </td>
              <td className="px-3 py-2 text-xs text-gray-500">{r.section ?? ""}</td>
              <td className="px-3 py-2 text-xs text-gray-500">{r.focus ?? ""}</td>
              <td className="px-3 py-2 text-xs text-gray-500">{r.source ?? ""}</td>
              <td className="px-3 py-2 text-xs text-gray-500">{r.role ?? ""}</td>
              <td className={clsx("px-3 py-2 font-mono text-xs whitespace-nowrap", r.has_error && "text-red-600")}>
                {r.value === null ? <span className="text-gray-300">null</span> : formatValue(r.value)}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-gray-400">{r.cell}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {r.has_formula && (
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded">fx</span>
                )}
                {r.has_error && (
                  <span className="inline-block bg-red-50 text-red-700 text-xs px-1.5 py-0.5 rounded ml-1">err</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
