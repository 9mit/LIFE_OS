
import { useRef } from "react";
import { exportDashboardToPDF } from "../utils/pdfExport";
import { useLifeOSStore } from "../store/useLifeOSStore";
import { Download } from "lucide-react";

export function ReportsPanel() {
  const { summary } = useLifeOSStore();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!dashboardRef.current || !summary) return;
    await exportDashboardToPDF(dashboardRef.current, summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 px-6 py-5 shadow-xl shadow-slate-900/10 dark:border-slate-700/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Report composer
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Freeze your current dashboard view into a polished PDF you can archive or share.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:from-indigo-600 hover:via-violet-500 hover:to-purple-500 disabled:opacity-50"
            disabled={!summary}
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      <div
        ref={dashboardRef}
        className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-2xl shadow-slate-900/15 ring-1 ring-white/50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:ring-slate-900/40"
      >
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Executive summary
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {summary?.narrative ?? "Surface a report-ready narrative by uploading your first dataset."}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <ReportBlock title="Keywords" value={summary?.keywords.join(", ") ?? "—"} />
          <ReportBlock title="Mood signals" value={summary?.moodWords.join(", ") ?? "—"} />
          <ReportBlock
            title="Forecast"
            value={
              summary?.forecasts.length
                ? summary.forecasts
                    .map((forecast) =>
                      `${forecast.field}: ${forecast.forecast.toFixed(2)}`
                    )
                    .join(" · ")
                : "Gather more history to generate confident projections."
            }
          />
        </div>
      </div>
    </div>
  );
}

function ReportBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 px-5 py-4 text-sm text-slate-500 shadow-inner dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <p className="mt-2 leading-relaxed">{value}</p>
    </div>
  );
}
