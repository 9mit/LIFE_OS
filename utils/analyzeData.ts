
import {
  CategoryDatum,
  InsightSummary,
  LifeOSDataRecord,
  TimeframeFilter,
  TimeSeriesDatum,
} from "../types/data";
import { average, groupBy } from "./utils";

export function summarizeData(
  records: LifeOSDataRecord[],
  timeframe: TimeframeFilter
): InsightSummary {
  if (!records || records.length === 0) {
    return {
      totalRecords: 0,
      activeSources: 0,
      keywords: [],
      moodWords: [],
      numericHighlights: [],
      categoryBreakdown: [],
      timeSeries: [],
      forecasts: [],
      narrative: "Upload your first dataset to unlock a living narrative of your routines.",
    };
  }

  const filtered = filterByTimeframe(records, timeframe);
  const keywords = aggregateKeywords(filtered);
  const numericHighlights = aggregateNumeric(filtered);
  const categoryBreakdown = aggregateCategories(filtered);
  const timeSeries = aggregateTimeSeries(filtered, timeframe);
  const moodWords = extractMoodWords(filtered);
  const forecasts = buildForecasts(filtered);

  const narrative = [
    `We analysed ${filtered.length} records across ${new Set(
      filtered.map((record) => record.sourceId)
    ).size} sources.`,
    numericHighlights.length
      ? `Key averages: ${numericHighlights
          .map((item) => `${item.field} (${item.average.toFixed(2)})`)
          .join(", ")}.`
      : "",
    categoryBreakdown.length
      ? `Dominant categories: ${categoryBreakdown
          .slice(0, 3)
          .map((item) => `${item.label} (${item.value})`)
          .join(", ")}.`
      : "",
    forecasts.length
      ? `Projected next values: ${forecasts
          .map(
            (forecast) => `${forecast.field} ≈ ${forecast.forecast.toFixed(2)}`
          )
          .join(", ")}.`
      : "",
    moodWords.length
      ? `Mood signals detected: ${moodWords.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    totalRecords: filtered.length,
    activeSources: new Set(filtered.map((record) => record.sourceId)).size,
    keywords,
    moodWords,
    numericHighlights,
    categoryBreakdown,
    timeSeries,
    forecasts,
    narrative,
  };
}

function filterByTimeframe(
  records: LifeOSDataRecord[],
  timeframe: TimeframeFilter
): LifeOSDataRecord[] {
  if (timeframe === "all") return records;
  const now = Date.now();
  const delta = timeframe === "week" ? 7 : 30;
  const threshold = now - delta * 24 * 60 * 60 * 1000;
  return records.filter((record) => record.timestamp >= threshold);
}

function aggregateKeywords(records: LifeOSDataRecord[]): string[] {
  const keywordMap: Record<string, number> = {};

  records.forEach((record) => {
    record.keywords.forEach((keyword) => {
      keywordMap[keyword] = (keywordMap[keyword] ?? 0) + 1;
    });
  });

  return Object.entries(keywordMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([keyword]) => keyword);
}

function extractMoodWords(records: LifeOSDataRecord[]): string[] {
  const moodIndicators = [
    "happy",
    "sad",
    "excited",
    "tired",
    "motivated",
    "anxious",
    "calm",
    "productive",
    "focused"
  ];

  const counts: Record<string, number> = {};
  records.forEach((record) => {
    record.textFields.forEach((text) => {
      moodIndicators.forEach((word) => {
        if (text.toLowerCase().includes(word)) {
          counts[word] = (counts[word] ?? 0) + 1;
        }
      });
    });
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word);
}

function aggregateNumeric(records: LifeOSDataRecord[]) {
  const numericValues: Record<string, number[]> = {};

  records.forEach((record) => {
    Object.entries(record.numericFields).forEach(([key, value]) => {
      if (!numericValues[key]) numericValues[key] = [];
      numericValues[key].push(value);
    });
  });

  return Object.entries(numericValues).map(([field, values]) => ({
    field,
    total: values.reduce((sum, value) => sum + value, 0),
    average: average(values),
  }));
}

function aggregateCategories(records: LifeOSDataRecord[]): CategoryDatum[] {
  const categoryMap: Record<string, number> = {};

  records.forEach((record) => {
    Object.values(record.categoricalFields).forEach((value) => {
      if (!value) return;
      categoryMap[value] = (categoryMap[value] ?? 0) + 1;
    });
  });

  return Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function aggregateTimeSeries(
  records: LifeOSDataRecord[],
  timeframe: TimeframeFilter
): TimeSeriesDatum[] {
  if (!records.length) return [];
  const grouped = groupBy(records, (record) => {
    const date = new Date(record.timestamp);
    if (timeframe === "week") {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    if (timeframe === "month") {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    return `${date.getFullYear()}`;
  });

  return Object.entries(grouped)
    .map(([label, group]) => ({ label, value: group.length }))
    .sort((a, b) => (a.label > b.label ? 1 : -1));
}

function buildForecasts(records: LifeOSDataRecord[]) {
  const numericSeries: Record<string, Array<{ x: number; y: number }>> = {};

  records
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((record, index) => {
      Object.entries(record.numericFields).forEach(([field, value]) => {
        if (!numericSeries[field]) numericSeries[field] = [];
        numericSeries[field].push({ x: index, y: value });
      });
    });

  return Object.entries(numericSeries)
    .map(([field, series]) => ({ field, forecast: linearRegressionForecast(series) }))
    .filter((item) => !Number.isNaN(item.forecast) && Number.isFinite(item.forecast))
    .sort((a, b) => b.forecast - a.forecast)
    .slice(0, 3);
}

function linearRegressionForecast(series: Array<{ x: number; y: number }>) {
  if (series.length < 3) return NaN;
  const n = series.length;
  const sumX = series.reduce((acc, point) => acc + point.x, 0);
  const sumY = series.reduce((acc, point) => acc + point.y, 0);
  const sumXY = series.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumX2 = series.reduce((acc, point) => acc + point.x * point.x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return NaN;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const nextX = series[series.length - 1].x + 1;
  return intercept + slope * nextX;
}
