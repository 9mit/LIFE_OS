
import { FormEvent, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { useLifeOSStore } from "../store/useLifeOSStore";
import { cosineSimilarity, keywordExtract, textEmbedding } from "../utils/embeddings";
import type {
  InsightSummary,
  LifeOSChatMessage,
  LifeOSDataRecord,
} from "../types/data";
import { summarizeData } from "../utils/analyzeData";
import { Trash2, Sparkles } from "lucide-react";

const THRESHOLD = 0.3;

const ChatAssistant = () => {
  const [input, setInput] = useState("");
  const [answering, setAnswering] = useState(false);
  const {
    appendChatMessage,
    chatHistory,
    setChatHistory,
    records,
    summary,
    timeframe,
  } = useLifeOSStore();
  const { addChatMessage, getChatHistory, resetChatHistory } = useIndexedDB();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory().then(setChatHistory);
  }, [getChatHistory, setChatHistory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const respond = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: LifeOSChatMessage = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    };

    setAnswering(true);
    appendChatMessage(userMessage);
    await addChatMessage(userMessage);

    const response = await generateAnswer(
      input.trim(),
      records,
      summary ?? summarizeData(records, timeframe)
    );
    const assistantMessage: LifeOSChatMessage = {
      id: nanoid(),
      role: "assistant",
      content: response,
      createdAt: Date.now(),
    };
    appendChatMessage(assistantMessage);
    await addChatMessage(assistantMessage);

    setInput("");
    setAnswering(false);
  };

  const handleResetChat = async () => {
    await resetChatHistory();
    setChatHistory([]);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/60 bg-white/90 px-6 py-5 text-sm text-slate-500 shadow-lg shadow-slate-900/10 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          Ask LifeOS anything
        </div>
        <p className="leading-relaxed">
          Ask for spending breakdowns, time allocation, or mood cues. The assistant retrieves embeddings locally, combines them with statistical context, and responds without touching external APIs.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="rounded-full border border-slate-200/60 px-3 py-1 dark:border-slate-700/60">
            “Summarize last week’s habits.”
          </span>
          <span className="rounded-full border border-slate-200/60 px-3 py-1 dark:border-slate-700/60">
            “Which category grew the fastest month over month?”
          </span>
          <span className="rounded-full border border-slate-200/60 px-3 py-1 dark:border-slate-700/60">
            “Forecast my workout time for next week.”
          </span>
        </div>
        <button
          onClick={handleResetChat}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:border-red-200 hover:text-red-500 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-red-400/60 dark:hover:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear conversation
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-inner shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-900/60"
      >
        {chatHistory.length ? (
          <div className="space-y-6">
            {chatHistory.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                  {message.role === "user" ? "You" : "LifeOS"}
                </div>
                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur ${
                    message.role === "user"
                      ? "ml-auto bg-indigo-500/90 text-white"
                      : "bg-white/90 text-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
            Ask your first question to begin the conversation.
          </div>
        )}
      </div>

      <form onSubmit={respond} className="flex items-center gap-3 rounded-3xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-lg shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-900/70">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-2xl border border-transparent bg-slate-100/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-indigo-500"
          placeholder="Ask anything about your personal data..."
          disabled={answering}
        />
        <button
          type="submit"
          className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:bg-indigo-600 disabled:opacity-50 dark:shadow-indigo-950/30"
          disabled={answering}
        >
          {answering ? "Analyzing..." : "Send"}
        </button>
      </form>
    </div>
  );
};

async function generateAnswer(
  question: string,
  records: LifeOSDataRecord[],
  summary: InsightSummary
): Promise<string> {
  if (!records.length) {
    return "No records are indexed yet. Upload your data to start the conversation.";
  }

  const queryEmbedding = await textEmbedding(question);
  const scored = (await Promise.all(records
    .map(async (record) => ({
      record,
      score: cosineSimilarity(queryEmbedding, record.embedding),
    }))))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const relevantRecords = scored.filter((item) => item.score > THRESHOLD);
  const keywords = await keywordExtract(question);

  if (!relevantRecords.length) {
    return `No direct matches yet. Keywords detected: ${keywords.join(", ")}. Try rephrasing or uploading more detail.`;
  }

  const numericCandidates: Record<string, number> = {};
  relevantRecords.forEach(({ record }) => {
    Object.entries(record.numericFields).forEach(([key, value]) => {
      numericCandidates[key] = (numericCandidates[key] ?? 0) + value;
    });
  });

  const bestNumeric = Object.entries(numericCandidates)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1);

  const categoryCounts: Record<string, number> = {};
  relevantRecords.forEach(({ record }) => {
    Object.values(record.categoricalFields).forEach((value) => {
      categoryCounts[value] = (categoryCounts[value] ?? 0) + 1;
    });
  });

  const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];

  const summarySnippet = summary?.narrative ?? "";
  const forecastMatches = summary?.forecasts.filter((forecast) =>
    question.toLowerCase().includes(forecast.field.toLowerCase())
  );

  return [
    bestNumeric.length
      ? `Approximate total for ${bestNumeric[0][0]}: ${bestNumeric[0][1].toFixed(2)}.`
      : null,
    topCategory ? `Most referenced category: ${topCategory[0]}.` : null,
    forecastMatches?.length
      ? `Projected next value: ${forecastMatches
          .map((item) => `${item.field} ≈ ${item.forecast.toFixed(2)}`)
          .join(" · ")}.`
      : summary?.forecasts.length
      ? `General projections: ${summary.forecasts
          .map((item) => `${item.field} ≈ ${item.forecast.toFixed(2)}`)
          .join(" · ")}.`
      : null,
    `Context sample: ${relevantRecords
      .map((item) => item.record.summary)
      .join(" | ")}`,
    summarySnippet ? `Global summary: ${summarySnippet}` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export { ChatAssistant };
