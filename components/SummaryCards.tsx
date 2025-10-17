
import type { InsightSummary } from "../types/data";
import { formatNumber } from "../utils/utils";

const FALLBACK_SUMMARY: InsightSummary = {
  totalRecords: 0,
  activeSources: 0,
  keywords: [],
  moodWords: [],
  numericHighlights: [],
  categoryBreakdown: [],
  timeSeries: [],
  forecasts: [],
  narrative: "Upload your personal analytics to unlock tailored insights.",
};

type SummaryCardsProps = {
  summary?: InsightSummary | null;
};

export function SummaryCards({ summary = FALLBACK_SUMMARY }: SummaryCardsProps) {
  const currentSummary = summary ?? FALLBACK_SUMMARY;

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card title="Records indexed" value={formatNumber(currentSummary.totalRecords)} />
      <Card title="Active sources" value={formatNumber(currentSummary.activeSources)} />
      <Card
        title="Top keywords"
        value={currentSummary.keywords.length ? currentSummary.keywords.join(", ") : "—"}
      />
      <Card title="Narrative" value={currentSummary.narrative} large />
      <Card
        title="Forecast"
        value={
          currentSummary.forecasts.length
            ? currentSummary.forecasts
                .map((forecast) =>
                  `${forecast.field}: ${forecast.forecast.toFixed(2)}`
                )
                .join(" · ")
            : "Add consistent data to surface predictive signals."
        }
      />
    </div>
  );
}

function Card({ title, value, large }: { title: string; value: string | number; large?: boolean }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200/60 bg-white/90 p-5 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 line-clamp-4 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
