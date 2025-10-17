
import { nanoid } from "nanoid";
import { LifeOSDataRecord } from "../types/data";
import { keywordExtract, textEmbedding } from "./embeddings";
import { parseDateGuess } from "./utils";

export async function parseText(
  file: File,
  sourceId: string
): Promise<LifeOSDataRecord[]> {
  const content = await file.text();
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return Promise.all(paragraphs.map(async (text) => {
    const keywords = await keywordExtract(text);
    const embedding = await textEmbedding(text);
    return {
      id: nanoid(),
      sourceId,
      timestamp: parseDateGuess({ paragraph: text }),
      summary: text.slice(0, 150),
      numericFields: {},
      categoricalFields: {},
      textFields: [text],
      keywords,
      embedding,
      raw: { text },
    };
  }));
}
