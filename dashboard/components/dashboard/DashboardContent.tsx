"use client";

import { motion } from "framer-motion";
import { ScoreboardOutput, FlatRecord } from "@/lib/scoreboard-types";
import { fadeUp, sectionStack } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { MetricChart } from "@/components/MetricChart";
import { AggregationPanel } from "@/components/AggregationPanel";
import { MetricsTable } from "@/components/tables/MetricsTable";
import { RecordsTable } from "@/components/tables/RecordsTable";
import { FormulaAuditTable } from "@/components/FormulaAuditTable";
import { JsonPreview } from "@/components/JsonPreview";

interface Props {
  output: ScoreboardOutput;
  flatRows: FlatRecord[];
}

export function DashboardContent({ output, flatRows }: Props) {
  const reduce = useReducedMotionSafe();
  const sheet = output.sheets[0];
  const metrics = sheet?.scoreboard.metrics ?? [];
  const audit = sheet?.scoreboard.formula_audit ?? [];

  const motionProps = reduce
    ? {}
    : { variants: sectionStack, initial: "hidden" as const, animate: "visible" as const };
  const itemProps = reduce ? {} : { variants: fadeUp };

  return (
    <motion.div className="space-y-8" {...motionProps}>
      <motion.section {...itemProps}>
        <SectionHeader title="Summary" description="High-level counts at a glance." />
        <SummaryCards output={output} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="Metric Chart" description="Pick a metric to see values over time." />
        <MetricChart metrics={metrics} flatRows={flatRows} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="Aggregation" description="Group and reduce numeric values." />
        <AggregationPanel flatRows={flatRows} metrics={metrics} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="Metrics" description="Every metric column with its metadata." />
        <MetricsTable metrics={metrics} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="Records" description="Flattened date by metric values." />
        <RecordsTable flatRows={flatRows} metrics={metrics} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="Formula Audit" description="Every formula and its cached result." />
        <FormulaAuditTable audit={audit} />
      </motion.section>

      <motion.section {...itemProps}>
        <SectionHeader title="JSON Preview" description="The full output JSON." />
        <JsonPreview output={output} />
      </motion.section>
    </motion.div>
  );
}
