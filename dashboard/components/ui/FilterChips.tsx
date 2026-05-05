"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onClear: () => void;
}

interface Props {
  filters: ActiveFilter[];
  onClearAll?: () => void;
}

export function FilterChips({ filters, onClearAll }: Props) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {filters.map((f) => (
          <motion.button
            key={f.key}
            type="button"
            onClick={f.onClear}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label={`Clear filter ${f.label}: ${f.value}`}
          >
            <span className="text-gray-500">{f.label}:</span>
            <span className="truncate max-w-[120px]">{f.value}</span>
            <X size={12} aria-hidden />
          </motion.button>
        ))}
      </AnimatePresence>
      {onClearAll && filters.length > 1 && (
        <Button size="sm" variant="ghost" onClick={onClearAll}>
          Clear all
        </Button>
      )}
    </div>
  );
}
