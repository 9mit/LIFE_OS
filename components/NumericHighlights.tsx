
import type { InsightSummary } from "../types/data";
import { formatNumber } from "../utils/utils";
import { BarChart3, Zap, ArrowUpRight } from "lucide-react";

type NumericHighlightsProps = {
  summary: InsightSummary | null;
};

export function NumericHighlights({ summary }: NumericHighlightsProps) {
  if (!summary || (!summary.numericHighlights.length && !summary.forecasts.length)) {
    return null;
  }

  const topHighlights = summary.numericHighlights.slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {topHighlights.map((item, index) => (
        <div
          key={item.field}
          style={{ animationDelay: `${index * 100}ms` }}
          className="group relative overflow-hidden rounded-3xl border border-champagne-200/50 bg-gradient-to-br from-white/95 via-champagne-50/30 to-white/95 p-7 shadow-premium backdrop-blur transition-all duration-300 hover:shadow-premium-lg animate-fade-in dark:border-champagne-500/20 dark:from-navy-900/90 dark:via-navy-800/50 dark:to-navy-900/90"
        >
          {/* Decorative Element */}
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-champagne-400/20 to-blush-400/10 blur-2xl transition-opacity group-hover:opacity-80" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-champagne-400 to-champagne-500 shadow-sm">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-500 dark:text-champagne-400">
                Signal Metric
              </span>
            </div>

            <h4 className="text-lg font-display font-semibold text-navy-900 dark:text-white mb-5">
              {item.field}
            </h4>

            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400 dark:text-slate-500 mb-1">
                  Total
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-champagne-600 to-blush-500 bg-clip-text text-transparent">
                  {formatNumber(Number(item.total.toFixed(2)))}
                </p>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-champagne-300/50 to-transparent dark:via-champagne-500/30" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400 dark:text-slate-500 mb-1">
                  Average
                </p>
                <p className="text-2xl font-bold text-navy-900 dark:text-white">
                  {item.average.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {summary.forecasts.slice(0, 2).map((forecast, index) => (
        <div
          key={`forecast-${forecast.field}`}
          style={{ animationDelay: `${(topHighlights.length + index) * 100}ms` }}
          className="group relative overflow-hidden rounded-3xl border border-blush-300/30 bg-gradient-to-br from-blush-500/10 via-champagne-500/5 to-navy-900/90 p-7 shadow-premium-lg backdrop-blur transition-all duration-300 hover:shadow-blush-glow animate-fade-in dark:from-blush-500/15 dark:via-champagne-500/10 dark:to-navy-950"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blush-500/5 to-champagne-500/5 opacity-50" />
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blush-400/30 to-champagne-400/20 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blush-400 to-blush-500 shadow-md shadow-blush-500/30">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-400">
                Forecast
              </span>
            </div>

            <h4 className="text-lg font-display font-semibold text-navy-900 dark:text-white mb-2">
              {forecast.field}
            </h4>

            <p className="text-sm text-navy-600/80 dark:text-champagne-200/70 mb-5">
              Next projected value based on linear regression applied to your latest dataset.
            </p>

            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold bg-gradient-to-r from-blush-500 to-champagne-500 bg-clip-text text-transparent">
                {forecast.forecast.toFixed(2)}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-500/20">
                <ArrowUpRight className="h-4 w-4 text-blush-400" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
