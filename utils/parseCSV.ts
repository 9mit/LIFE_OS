import Papa from "papaparse";
import { nanoid } from "nanoid";
import { LifeOSDataRecord } from "../types/data";
import { keywordExtract, textEmbedding } from "./embeddings";
import { normalizeValue, parseDateGuess } from "./utils";

export async function parseCSV(
  file: File,
  sourceId: string
): Promise<LifeOSDataRecord[]> {
  const content = await file.text();
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const { data } = parsed;
  return Promise.all(
    data.map(async (row) => {
      const numericFields: Record<string, number> = {};
      const categoricalFields: Record<string, string> = {};
      const textBuckets: string[] = [];
      let keywords: string[] = [];

      for (const [key, value] of Object.entries(row)) {
        if (value === undefined || value === null || value === "") continue;
        const normalizedKey = key.trim();
        // FIX: The type of `value` can be inferred as 'unknown', so we safely convert it to a string before trimming.
        const normalizedValue = String(value).trim();

        const numeric = Number(normalizedValue);
        if (!Number.isNaN(numeric) && normalizedValue !== "") {
          numericFields[normalizedKey] = numeric;
        } else {
            categoricalFields[normalizedKey] = normalizeValue(normalizedValue);
        }

        textBuckets.push(`${normalizedKey}: ${normalizedValue}`);
        const extractedKeywords = await keywordExtract(normalizedValue);
        keywords.push(...extractedKeywords);
      }

      const combinedText = textBuckets.join(" | ");
      const embedding = await textEmbedding(combinedText);
      const timestamp = parseDateGuess(row);

      return {
        id: nanoid(),
        sourceId,
        timestamp,
        summary: combinedText.slice(0, 150) || file.name,
        numericFields,
        categoricalFields,
        textFields: textBuckets,
        keywords: [...new Set(keywords)],
        embedding,
        raw: row,
      } satisfies LifeOSDataRecord;
    })
  );
}
