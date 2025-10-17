
import { nanoid } from "nanoid";
import { LifeOSDataRecord } from "../types/data";
import { keywordExtract, textEmbedding } from "./embeddings";
import { parseDateGuess } from "./utils";

export async function parseJSON(
  file: File,
  sourceId: string
): Promise<LifeOSDataRecord[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (Array.isArray(data)) {
    const results = await Promise.all(
        data.flatMap((item, index) => mapJsonEntry(item, sourceId, `${index}`))
    );
    return results.flat();
  }
  
  return mapJsonEntry(data, sourceId, "root");
}

async function mapJsonEntry(
  entry: unknown,
  sourceId: string,
  _suffix: string
): Promise<LifeOSDataRecord[]> {
  if (typeof entry !== "object" || entry === null) {
    const value = String(entry);
    const keywords = await keywordExtract(value);
    const embedding = await textEmbedding(value);
    return [
      {
        id: nanoid(),
        sourceId,
        timestamp: parseDateGuess({ value }),
        summary: value.slice(0, 150),
        numericFields: {},
        categoricalFields: {},
        textFields: [value],
        keywords,
        embedding,
        raw: { value },
      },
    ];
  }

  const typedEntry = entry as Record<string, unknown>;
  let keywords: string[] = [];
  const textFields: string[] = [];
  const numericFields: Record<string, number> = {};
  const categoricalFields: Record<string, string> = {};

  for (const [key, value] of Object.entries(typedEntry)) {
    if (typeof value === "number") {
      numericFields[key] = value;
    } else if (typeof value === "string") {
      textFields.push(`${key}: ${value}`);
      const extractedKeywords = await keywordExtract(value);
      keywords.push(...extractedKeywords);
      categoricalFields[key] = value;
    } else if (Array.isArray(value)) {
      const stringifiedArray = value.join(", ");
      textFields.push(`${key}: ${stringifiedArray}`);
      const extractedKeywords = await keywordExtract(stringifiedArray);
      keywords.push(...extractedKeywords);
    } else if (value && typeof value === "object") {
        const stringifiedObject = JSON.stringify(value);
      textFields.push(`${key}: ${stringifiedObject}`);
    }
  }

  const summary = textFields.join(" | ");
  const timestamp = parseDateGuess(
    Object.fromEntries(
      Object.entries(typedEntry)
        .filter(([, value]) => typeof value === "string")
        .map(([key, value]) => [key, value as string])
    )
  );

  const embedding = await textEmbedding(summary);

  return [
    {
      id: nanoid(),
      sourceId,
      timestamp,
      summary: summary.slice(0, 150) || sourceId,
      numericFields,
      categoricalFields,
      textFields,
      keywords: [...new Set(keywords)],
      embedding,
      raw: typedEntry,
    },
  ];
}
