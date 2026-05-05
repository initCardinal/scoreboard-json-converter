"use client";

import { AlertCircle } from "lucide-react";
import { Card } from "./Card";
import { CollapsiblePanel } from "./CollapsiblePanel";

interface Props {
  title: string;
  message: string;
  detail?: string;
}

export function ErrorPanel({ title, message, detail }: Props) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <div role="alert" aria-live="assertive" className="flex gap-3">
        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-900">{title}</p>
          <p className="text-sm text-red-800 mt-1 break-words">{message}</p>
          {detail && (
            <div className="mt-3">
              <CollapsiblePanel label="Developer details">
                <pre className="text-xs font-mono text-red-900 whitespace-pre-wrap break-words max-h-60 overflow-auto">
                  {detail}
                </pre>
              </CollapsiblePanel>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
