
import type { InsightSummary } from "../types/data";
import { formatNumber } from "../utils/utils";

type NumericHighlightsProps = {
  summary: InsightSummary | null;
};

export function NumericHighlights({ summary }: NumericHighlightsProps) {
  if (!summary || (!summary.numericHighlights.length && !summary.forecasts.length)) {
    return null;
  }

  const topHighlights = summary.numericHighlights.slice(0, 4);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {topHighlights.map((item) => (
        <div
          key={item.field}
          className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-100/60 p-6 shadow-lg shadow-slate-900/10 ring-1 ring-white/30 dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950/90 dark:ring-slate-900/60"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Signal metric
          </span>
          <h4 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {item.field}
          </h4>
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-300">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Total
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatNumber(Number(item.total.toFixed(2)))}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Avg
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {item.average.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
      {summary.forecasts.slice(0, 2).map((forecast) => (
        <div
          key={`forecast-${forecast.field}`}
          className="rounded-3xl border border-indigo-300/50 bg-gradient-to-br from-indigo-500/15 via-indigo-500/10 to-blue-500/10 p-6 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-200/60 dark:border-indigo-500/30 dark:from-indigo-500/20 dark:via-indigo-500/10 dark:to-slate-900"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-indigo-300">
            Forecast
          </span>
          <h4 className="mt-2 text-lg font-semibold text-white">
            {forecast.field}
          </h4>
          <p className="mt-3 text-sm text-indigo-100/90">
            Next projected value based on linear regression applied to your latest dataset.
          </p>
          <p className="mt-5 text-3xl font-bold text-white">
            {forecast.forecast.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}
