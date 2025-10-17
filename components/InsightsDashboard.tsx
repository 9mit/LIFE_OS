import { useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";
import { SummaryCards } from "./SummaryCards";
import { NumericHighlights } from "./NumericHighlights";
import { useLifeOSStore } from "../store/useLifeOSStore";
import { useTheme } from "../hooks/useTheme";
// FIX: Import TimeframeFilter to correctly type the range labels.
import type { TimeframeFilter } from "../types/data";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

// FIX: Use TimeframeFilter for keys to ensure type safety when calling setTimeframe.
const RANGE_LABEL: Record<TimeframeFilter, string> = {
  week: "Week",
  month: "Month",
  all: "All",
};

export function InsightsDashboard() {
  const { summary, timeframe, setTimeframe } = useLifeOSStore();
  const { theme } = useTheme();

  const categoryData = useMemo(() => {
    if (!summary?.categoryBreakdown?.length) return null;
    return {
      labels: summary.categoryBreakdown.map((item) => item.label),
      datasets: [
        {
          label: "Frequency",
          data: summary.categoryBreakdown.map((item) => item.value),
          backgroundColor: [
            "rgba(79, 70, 229, 0.85)",
            "rgba(14, 165, 233, 0.85)",
            "rgba(59, 130, 246, 0.85)",
            "rgba(126, 58, 242, 0.85)",
            "rgba(249, 115, 22, 0.85)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [summary]);

  const timeSeriesData = useMemo(() => {
    if (!summary?.timeSeries?.length) return null;
    return {
      labels: summary.timeSeries.map((datum) => datum.label),
      datasets: [
        {
          label: "Activity",
          data: summary.timeSeries.map((datum) => datum.value),
          borderColor: "rgba(79, 70, 229, 0.9)",
          backgroundColor: "rgba(79, 70, 229, 0.15)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [summary]);

  const textColor = theme === "dark" ? "#E2E8F0" : "#0f172a";

  return (
    <div className="space-y-8">
      <SummaryCards summary={summary} />

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Time range
        </span>
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
          {(Object.keys(RANGE_LABEL) as Array<keyof typeof RANGE_LABEL>).map((range) => (
            <button
              key={range}
              onClick={() => setTimeframe(range)}
              className={`rounded-full px-4 py-1.5 transition ${
                timeframe === range
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {RANGE_LABEL[range]}
            </button>
          ))}
        </div>
      </div>

      <NumericHighlights summary={summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-white/50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:ring-slate-900/40">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Category pulse
          </h3>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            Where your attention is clustering
          </p>
          {categoryData ? (
            <div className="mt-6">
              <Pie
                data={categoryData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: textColor,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Add at least one dataset to unlock category intelligence.
            </p>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-white/50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:ring-slate-900/40">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Activity rhythm
          </h3>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            Track consistency across time
          </p>
          {timeSeriesData ? (
            <div className="mt-6 h-72">
              <Line
                data={timeSeriesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      ticks: { color: textColor },
                      grid: {
                        color:
                          theme === "dark"
                            ? "rgba(148, 163, 184, 0.2)"
                            : "rgba(148, 163, 184, 0.3)",
                      },
                    },
                    y: {
                      ticks: { color: textColor },
                      grid: {
                        color:
                          theme === "dark"
                            ? "rgba(148, 163, 184, 0.2)"
                            : "rgba(148, 163, 184, 0.2)",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Once your data includes time references, LifeOS will reveal pacing insights automatically.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-2xl shadow-slate-900/40">
        <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/80 px-8 py-6 text-slate-200 backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300/70">
            Narrative summary
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-200/90">
            {summary?.narrative ?? "Upload your first dataset to unlock a living narrative of your routines."}
          </p>
        </div>
      </div>
    </div>
  );
}
