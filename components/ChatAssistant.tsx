
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
import { Trash2, Sparkles, Send, Bot, User, MessageCircle } from "lucide-react";

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
    <div className="flex h-full flex-col gap-6 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-champagne-200/50 bg-gradient-to-r from-white/95 via-champagne-50/30 to-white/95 px-8 py-6 shadow-premium backdrop-blur dark:border-champagne-500/20 dark:from-navy-900/90 dark:via-navy-800/50 dark:to-navy-900/90">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-champagne-400/20 to-blush-400/10 blur-2xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-champagne-400 to-blush-500 shadow-md shadow-champagne-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne-500 dark:text-champagne-400">
                Ask LifeOS
              </span>
              <p className="text-sm text-navy-600/80 dark:text-slate-300">
                Converse with your data using AI-powered insights
              </p>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="flex flex-wrap gap-2">
            {[
              "Summarize last week's habits",
              "Which category grew fastest?",
              "Forecast my activity",
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="rounded-xl border border-champagne-200/50 bg-white/60 px-4 py-2 text-xs font-medium text-navy-600 transition-all hover:border-champagne-400 hover:bg-champagne-50 dark:border-champagne-500/20 dark:bg-navy-800/50 dark:text-champagne-300 dark:hover:border-champagne-400/50"
              >
                "{question}"
              </button>
            ))}
          </div>

          <button
            onClick={handleResetChat}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-blush-200/50 bg-white/60 px-4 py-2 text-xs font-medium text-blush-600 transition-all hover:border-blush-400 hover:bg-blush-50 dark:border-blush-500/20 dark:bg-navy-800/50 dark:text-blush-300 dark:hover:border-blush-400/50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear conversation
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-3xl border border-champagne-200/50 bg-gradient-to-b from-white/80 via-champagne-50/20 to-white/80 p-6 shadow-inner backdrop-blur dark:border-champagne-500/20 dark:from-navy-900/60 dark:via-navy-800/40 dark:to-navy-900/60"
      >
        {chatHistory.length ? (
          <div className="space-y-6">
            {chatHistory.map((message, index) => (
              <div
                key={message.id}
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  {message.role === "user" ? (
                    <>
                      <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-blush-400 to-blush-500 flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-blush-500 dark:text-blush-400">You</span>
                    </>
                  ) : (
                    <>
                      <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-champagne-400 to-champagne-500 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-champagne-500 dark:text-champagne-400">LifeOS</span>
                    </>
                  )}
                </div>
                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${message.role === "user"
                    ? "ml-auto bg-gradient-to-r from-blush-500 to-blush-600 text-white border border-blush-400/30"
                    : "bg-gradient-to-r from-white/95 to-champagne-50/50 text-navy-700 border border-champagne-200/50 dark:from-navy-800/90 dark:to-navy-900/70 dark:text-champagne-100 dark:border-champagne-500/20"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center py-16">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-champagne-100 to-blush-100 dark:from-champagne-900/30 dark:to-blush-900/30 flex items-center justify-center mb-6">
              <MessageCircle className="h-10 w-10 text-champagne-400" />
            </div>
            <p className="text-lg font-display font-semibold text-navy-900 dark:text-white mb-2">
              Start a conversation
            </p>
            <p className="text-sm text-navy-500 dark:text-slate-400 max-w-md">
              Ask your first question to begin exploring your personal data insights.
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={respond}
        className="flex items-center gap-4 rounded-3xl border border-champagne-200/50 bg-gradient-to-r from-white/95 via-champagne-50/30 to-white/95 px-4 py-3 shadow-premium backdrop-blur dark:border-champagne-500/20 dark:from-navy-900/90 dark:via-navy-800/50 dark:to-navy-900/90"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-2xl border border-champagne-200/50 bg-white/80 px-5 py-4 text-sm text-navy-700 outline-none transition-all placeholder:text-navy-400/50 focus:border-champagne-400 focus:ring-2 focus:ring-champagne-400/20 dark:border-champagne-500/20 dark:bg-navy-900/80 dark:text-champagne-100 dark:placeholder:text-slate-500 dark:focus:border-champagne-400/50"
          placeholder="Ask anything about your personal data..."
          disabled={answering}
        />
        <button
          type="submit"
          disabled={answering || !input.trim()}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-champagne-500 to-blush-500 shadow-lg shadow-champagne-500/30 transition-all hover:shadow-champagne-500/50 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {answering ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Send className="h-5 w-5 text-white transition-transform group-hover:translate-x-0.5" />
          )}
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

  // Always recalculate summary for accurate counts
  const actualSummary = summary.totalRecords > 0 ? summary : summarizeData(records, "all");
  const totalRecords = records.length;
  const totalSources = new Set(records.map(r => r.sourceId)).size;

  if (!relevantRecords.length) {
    const keywordDisplay = keywords.length > 0
      ? `Keywords detected: ${keywords.join(", ")}.`
      : "";
    return `I found ${totalRecords} records across ${totalSources} source(s), but no exact matches for your query. ${keywordDisplay} Try rephrasing or asking about specific categories like spending, health, or habits.`;
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

  const forecastMatches = actualSummary?.forecasts.filter((forecast) =>
    question.toLowerCase().includes(forecast.field.toLowerCase())
  );

  return [
    `Based on ${totalRecords} records from ${totalSources} source(s):`,
    bestNumeric.length
      ? `Approximate total for ${bestNumeric[0][0]}: ${bestNumeric[0][1].toFixed(2)}.`
      : null,
    topCategory ? `Most referenced category: ${topCategory[0]}.` : null,
    forecastMatches?.length
      ? `Projected next value: ${forecastMatches
        .map((item) => `${item.field} ≈ ${item.forecast.toFixed(2)}`)
        .join(" · ")}.`
      : actualSummary?.forecasts.length
        ? `General projections: ${actualSummary.forecasts
          .map((item) => `${item.field} ≈ ${item.forecast.toFixed(2)}`)
          .join(" · ")}.`
        : null,
    `Context sample: ${relevantRecords
      .map((item) => item.record.summary)
      .join(" | ")}`,
  ]
    .filter(Boolean)
    .join(" ");
}

export { ChatAssistant };
