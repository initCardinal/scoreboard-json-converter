"use client";

import { MetricDefinition } from "@/lib/scoreboard-types";

interface Props {
  metrics: MetricDefinition[];
}

export function MetricsTableDesktop({ metrics }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            {["ID", "Heading", "Section", "Focus", "Source", "Role", "Col", "Hidden", "Target"].map((h) => (
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
          {metrics.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-xs text-gray-500 break-all max-w-[220px]">{m.id}</td>
              <td className="px-3 py-2 max-w-xs break-words">{m.heading}</td>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{m.section ?? ""}</td>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{m.focus ?? ""}</td>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{m.source ?? ""}</td>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{m.role ?? ""}</td>
              <td className="px-3 py-2 font-mono text-xs">{m.column}</td>
              <td className="px-3 py-2">
                {m.hidden && (
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded">
                    hidden
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap text-xs">
                {m.target.label ?? ""}
                {m.target.value !== null ? ` ${m.target.value}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
