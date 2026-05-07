"use client";

import { Download, RefreshCw, Play, FileSpreadsheet, FileJson } from "lucide-react";
import { ScoreboardOutput } from "@/lib/scoreboard-types";
import { DashboardStatus } from "@/hooks/useDashboardData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { downloadJson } from "@/lib/download";

const IS_PREVIEW = process.env.NODE_ENV === "production";

interface Props {
  status: DashboardStatus;
  output: ScoreboardOutput | null;
  notice: string | null;
  onRun: () => void;
  onRefresh: () => void;
}

export default function RunConverterPanel({ status, output, notice, onRun, onRefresh }: Props) {
  const busy = status === "converting" || status === "loading_output";
  const hasOutput = output !== null;

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-700 flex-wrap">
            <FileSpreadsheet size={16} className="text-green-600 shrink-0" aria-hidden />
            <span className="text-gray-500">Source</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono break-all">
              Scoreboard Test.xlsx
            </code>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 flex-wrap">
            <FileJson size={16} className="text-blue-600 shrink-0" aria-hidden />
            <span className="text-gray-500">Output</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono break-all">
              output.json
            </code>
          </div>
        </div>
        
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <Button
          variant="primary"
          onClick={onRun}
          disabled={busy}
          fullWidth
          iconLeft={<Play size={14} aria-hidden />}
          aria-label="Run converter"
        >
          {status === "converting" ? "Running..." : "Run Converter"}
        </Button>
        <Button
          variant="secondary"
          onClick={onRefresh}
          disabled={busy}
          fullWidth
          iconLeft={
            <RefreshCw size={14} className={status === "loading_output" ? "animate-spin" : ""} aria-hidden />
          }
          aria-label="Refresh output JSON from disk"
        >
          Refresh Output
        </Button>
        <Button
          variant="secondary"
          onClick={() => output && downloadJson(output)}
          disabled={!hasOutput}
          fullWidth
          iconLeft={<Download size={14} aria-hidden />}
          aria-label="Download output.json"
        >
          Download JSON
        </Button>
      </div>

      {notice && (
        <p className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-2">
          {notice}
        </p>
      )}

      {output?.meta && (
        <p className="mt-4 text-xs text-gray-400 break-words">
          Generated {output.meta.generated_at} | v{output.meta.converter_version}
          {output.meta.warnings.length > 0 && (
            <span className="ml-2 text-amber-600">
              {output.meta.warnings.length} warning(s)
            </span>
          )}
        </p>
      )}
    </Card>
  );
}
