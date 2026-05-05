"use client";

import { Loader2 } from "lucide-react";
import { Card } from "./Card";

interface Props {
  title?: string;
  description?: string;
}

export function LoadingPanel({
  title = "Working...",
  description = "Please wait while the request completes.",
}: Props) {
  return (
    <Card className="text-center">
      <div className="flex flex-col items-center gap-3 py-8" role="status" aria-live="polite">
        <Loader2 className="animate-spin text-gray-500" size={28} aria-hidden />
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}
