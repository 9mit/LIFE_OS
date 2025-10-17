
import { useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { UploadPanel } from "./components/UploadPanel";
import { InsightsDashboard } from "./components/InsightsDashboard";
import { ChatAssistant } from "./components/ChatAssistant";
import { ReportsPanel } from "./components/ReportsPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { useLifeOSStore } from "./store/useLifeOSStore";
import { useIndexedDB } from "./hooks/useIndexedDB";
import { summarizeData } from "./utils/analyzeData";
import { Loader2 } from "lucide-react";

function App() {
  const {
    view,
    setView,
    setSources,
    setRecords,
    setSummary,
    timeframe,
    sources,
    records,
    isLoading,
    reset,
    setChatHistory,
  } = useLifeOSStore();
  const { getAllRecords, getAllSources, clearAll, resetChatHistory: clearChatHistoryDB } =
    useIndexedDB();

  useEffect(() => {
    const bootstrap = async () => {
      const [loadedSources, loadedRecords] = await Promise.all([
        getAllSources(),
        getAllRecords(),
      ]);
      setSources(loadedSources);
      setRecords(loadedRecords);
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSummary(summarizeData(records, timeframe));
  }, [records, setSummary, timeframe]);

  const handleReset = async () => {
    await clearAll();
    await clearChatHistoryDB();
    reset();
    setChatHistory([]);
    setSummary(summarizeData([], timeframe));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-black dark:text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <NavBar active={view} onSelect={setView} />

        <main className="relative flex flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-transparent opacity-40 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-transparent opacity-30 blur-3xl" />
          </div>
          <header className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/30">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Personal Intelligence Hub
              </span>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-900 dark:text-white lg:text-4xl">
                LifeOS keeps your personal data insights private, powerful, and beautifully organized.
              </h1>
              <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-300">
                Upload activity logs, journals, and exports to unlock summaries, trends, and quick answers—all computed directly in your browser with zero cloud dependencies.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
              <ThemeToggle />
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Sources tracked
                  </span>
                  <span className="text-base font-semibold text-slate-800 dark:text-white">
                    {sources.length}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />
                <div className="flex flex-col text-right">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Records indexed
                  </span>
                  <span className="text-base font-semibold text-slate-800 dark:text-white">
                    {records.length}
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-400/50 transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:shadow-red-950/40"
              >
                Reset workspace
              </button>
            </div>
          </header>

          <section className="flex-1">
            {view === "upload" && <UploadPanel />}
            {view === "insights" && <InsightsDashboard />}
            {view === "chat" && <ChatAssistant />}
            {view === "reports" && <ReportsPanel />}
          </section>

          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/70 backdrop-blur dark:bg-slate-900/70">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-200">
                Processing data...
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
