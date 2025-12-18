
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
import { Loader2, Sparkles, Database, FileText, RotateCcw } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-champagne-100/50 text-navy-900 transition-colors dark:from-navy-950 dark:via-navy-900 dark:to-obsidian-950 dark:text-champagne-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[300px_1fr]">
        <NavBar active={view} onSelect={setView} />

        <main className="relative flex flex-col gap-10 px-6 py-10 md:px-10 lg:px-16 overflow-x-hidden">
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-champagne-400/30 via-blush-400/20 to-transparent blur-3xl dark:from-champagne-500/10 dark:via-blush-500/10" />
            <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blush-400/20 via-champagne-400/15 to-transparent blur-3xl dark:from-blush-500/10 dark:via-champagne-500/5" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-navy-400/10 via-champagne-400/10 to-transparent blur-3xl dark:from-navy-500/5 dark:via-champagne-500/5" />
          </div>

          {/* Premium Header */}
          <header className="relative overflow-hidden rounded-3xl border border-champagne-200/50 bg-gradient-to-r from-white/95 via-champagne-50/40 to-white/95 p-8 shadow-premium backdrop-blur dark:border-champagne-500/20 dark:from-navy-900/90 dark:via-navy-800/50 dark:to-navy-900/90">
            {/* Decorative Accent */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-champagne-400/30 to-blush-400/20 blur-2xl" />

            <div className="relative flex flex-wrap items-start justify-between gap-8">
              {/* Left Section - Brand & Description */}
              <div className="space-y-4 max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-champagne-300/50 bg-gradient-to-r from-champagne-100/80 to-white/80 px-4 py-1.5 dark:border-champagne-500/30 dark:from-champagne-900/30 dark:to-navy-800/30">
                  <Sparkles className="h-3.5 w-3.5 text-champagne-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600 dark:text-champagne-400">
                    Personal Intelligence Hub
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-3xl font-semibold leading-tight text-navy-900 dark:text-white lg:text-4xl">
                  Your data insights, <span className="bg-gradient-to-r from-champagne-500 to-blush-500 bg-clip-text text-transparent">beautifully organized</span>
                </h1>

                {/* Description */}
                <p className="text-sm leading-relaxed text-navy-600/80 dark:text-champagne-200/70 max-w-xl">
                  Upload activity logs, journals, and exports to unlock summaries, trends, and quick answers—all computed directly in your browser with zero cloud dependencies.
                </p>
              </div>

              {/* Right Section - Stats & Actions */}
              <div className="flex flex-col items-end gap-4">
                <ThemeToggle />

                {/* Stats Cards */}
                <div className="flex items-center gap-4 rounded-2xl border border-champagne-200/50 bg-gradient-to-r from-white/80 to-champagne-50/50 px-5 py-4 shadow-sm dark:border-champagne-500/20 dark:from-navy-900/80 dark:to-navy-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-champagne-400 to-champagne-500 shadow-sm">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-navy-400 dark:text-slate-500">
                        Sources
                      </p>
                      <p className="text-lg font-bold text-navy-900 dark:text-white">
                        {sources.length}
                      </p>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-gradient-to-b from-transparent via-champagne-300/50 to-transparent dark:via-champagne-500/30" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blush-400 to-blush-500 shadow-sm">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-navy-400 dark:text-slate-500">
                        Records
                      </p>
                      <p className="text-lg font-bold text-navy-900 dark:text-white">
                        {records.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="group inline-flex items-center gap-2 rounded-xl border border-blush-200/50 bg-gradient-to-r from-blush-50/80 to-white/80 px-5 py-2.5 text-sm font-semibold text-blush-600 shadow-sm transition-all hover:border-blush-300 hover:shadow-md dark:border-blush-500/20 dark:from-blush-900/30 dark:to-navy-900/50 dark:text-blush-300 dark:hover:border-blush-400/40"
                >
                  <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-90" />
                  Reset Workspace
                </button>
              </div>
            </div>
          </header>

          {/* Content Section */}
          <section className="flex-1">
            {view === "upload" && <UploadPanel />}
            {view === "insights" && <InsightsDashboard />}
            {view === "chat" && <ChatAssistant />}
            {view === "reports" && <ReportsPanel />}
          </section>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/80 backdrop-blur-md dark:bg-navy-900/80">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-champagne-400 to-blush-500 blur-xl opacity-50 animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-champagne-400 to-blush-500 shadow-premium">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-navy-900 dark:text-white">
                  Processing your data
                </p>
                <p className="text-xs text-navy-500 dark:text-slate-400">
                  Analyzing patterns and generating insights...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
