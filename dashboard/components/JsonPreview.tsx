"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { ScoreboardOutput } from "@/lib/scoreboard-types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { downloadJson } from "@/lib/download";

interface Props {
  output: ScoreboardOutput;
}

export function JsonPreview({ output }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const jsonStr = useMemo(() => JSON.stringify(output, null, 2), [output]);
  const sizeKb = useMemo(
    () => (new TextEncoder().encode(jsonStr).length / 1024).toFixed(1),
    [jsonStr]
  );

  return (
    <Card padded={false}>
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          {collapsed ? "Expand JSON" : "Collapse JSON"}
        </Button>
        <span className="text-xs text-gray-500">{sizeKb} KB</span>
        <div className="ml-auto flex gap-2 flex-wrap">
          <CopyButton text={jsonStr} />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => downloadJson(output)}
            iconLeft={<Download size={12} aria-hidden />}
            aria-label="Download output.json"
          >
            Download
          </Button>
        </div>
      </div>

      {!collapsed && (
        <pre className="p-4 text-xs font-mono bg-gray-50 overflow-x-auto max-h-[60vh] overflow-y-auto leading-relaxed text-gray-700 whitespace-pre">
          {jsonStr}
        </pre>
      )}
    </Card>
  );
}
