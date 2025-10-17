
import React, { useState } from "react";
import { UploadCloud, ShieldCheck } from "lucide-react";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { useLifeOSStore } from "../store/useLifeOSStore";
import { parseCSV } from "../utils/parseCSV";
import { parseText } from "../utils/parseText";
import { parseJSON } from "../utils/parseJSON";
import type { LifeOSDataRecord, LifeOSSource } from "../types/data";

export function UploadPanel() {
  const { addSource, addRecords, getAllRecords, getAllSources } = useIndexedDB();
  const { setSources, setRecords, setLoading } = useLifeOSStore();
  const [status, setStatus] = useState<string>("");

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setStatus("Indexing your files...");
    setLoading(true);

    try {
      for (const file of Array.from(files)) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        let sourceType: LifeOSSource["type"] | null = null;

        if (extension === "csv") sourceType = "csv";
        else if (extension === "json") sourceType = "json";
        else if (["txt", "md"].includes(extension ?? "")) sourceType = "txt";

        if (!sourceType) {
          setStatus(`Unsupported format: ${file.name}`);
          continue;
        }

        const source = await addSource(file.name, sourceType);

        let records: LifeOSDataRecord[] = [];
        if (sourceType === "csv") records = await parseCSV(file, source.id);
        if (sourceType === "json") records = await parseJSON(file, source.id);
        if (sourceType === "txt") records = await parseText(file, source.id);

        await addRecords(records);
      }

      const [allSources, allRecords] = await Promise.all([
        getAllSources(),
        getAllRecords(),
      ]);

      setSources(allSources);
      setRecords(allRecords);
      setStatus("Files processed successfully.");
    } catch (error) {
      console.error("Error processing files", error);
      setStatus("Something went wrong while reading your files.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    await handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 shadow-xl shadow-slate-900/10 ring-1 ring-white/40 drop-shadow-xl transition hover:border-indigo-200/80 dark:border-slate-700/70 dark:bg-slate-900/70 dark:ring-slate-900/60" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Drop your life logs here
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-300">
              Upload CSV expenses, activity trackers, JSON exports, or plain-text journals. LifeOS will normalize every line, extract keywords, and prepare embeddings entirely in your browser.
            </p>
          </div>
          <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:from-indigo-600 hover:via-violet-500 hover:to-purple-500 cursor-pointer">
            Choose files
            <input
              type="file"
              accept=".csv,.json,.txt,.md"
              multiple
              onChange={(event) => handleFiles(event.target.files)}
              className="hidden"
            />
          </label>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Or drag & drop to ingest
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 px-5 py-4 text-sm text-slate-500 shadow-inner dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
        <ShieldCheck className="h-5 w-5 text-emerald-500" />
        <p className="leading-relaxed">
          Your files never leave the browser. LifeOS stores normalized data in IndexedDB so you can work offline and clear everything with a single click whenever you like.
        </p>
      </div>
      {status && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
          {status}
        </div>
      )}
    </div>
  );
}
