"use client";

import React, { useId, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { collapse } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface Props {
  label: string;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CollapsiblePanel({ label, defaultOpen = false, badge, children, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotionSafe();
  const id = useId();
  const panelId = `${id}-panel`;

  return (
    <div className={clsx("border border-gray-200 rounded-lg bg-white overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset"
      >
        <span className="flex items-center gap-2">
          {label}
          {badge}
        </span>
        <ChevronDown
          size={16}
          className={clsx("transition-transform text-gray-500", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            variants={reduce ? undefined : collapse}
            initial={reduce ? false : "hidden"}
            animate="visible"
            exit={reduce ? undefined : "exit"}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
