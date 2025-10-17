
const VOCAB: Record<string, number[]> = {
  food: [0.9, 0.1, 0.05, 0.02, 0.4, 0.7, 0.1, 0.3],
  travel: [0.1, 0.8, 0.1, 0.2, 0.3, 0.2, 0.5, 0.4],
  work: [0.2, 0.1, 0.9, 0.6, 0.2, 0.3, 0.4, 0.3],
  health: [0.3, 0.2, 0.3, 0.9, 0.2, 0.5, 0.1, 0.5],
  mood: [0.1, 0.1, 0.1, 0.3, 0.9, 0.2, 0.1, 0.1],
  fitness: [0.05, 0.2, 0.1, 0.8, 0.2, 0.4, 0.1, 0.5],
  finance: [0.8, 0.3, 0.2, 0.1, 0.6, 0.4, 0.2, 0.1],
  family: [0.2, 0.1, 0.3, 0.4, 0.1, 0.6, 0.8, 0.2],
  study: [0.1, 0.2, 0.8, 0.3, 0.1, 0.3, 0.4, 0.7],
  rest: [0.1, 0.1, 0.2, 0.6, 0.1, 0.2, 0.5, 0.8],
  colleagues: [0.2, 0.2, 0.8, 0.1, 0.1, 0.3, 0.3, 0.4],
  run: [0.1, 0.3, 0.1, 0.7, 0.2, 0.5, 0.2, 0.6],
  workout: [0.1, 0.2, 0.1, 0.8, 0.2, 0.4, 0.1, 0.5],
  habits: [0.3, 0.2, 0.4, 0.7, 0.5, 0.6, 0.3, 0.5],
  spending: [0.8, 0.1, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1]
};

const EMBEDDING_SIZE = 8;
const DEFAULT_VECTOR = new Array(EMBEDDING_SIZE).fill(0);

// Functions are async to simulate a more realistic scenario (e.g., using a worker thread)
export async function textEmbedding(text: string): Promise<number[]> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return [...DEFAULT_VECTOR];

  const vector = new Array(EMBEDDING_SIZE).fill(0);
  tokens.forEach((token) => {
    const embedding = VOCAB[token];
    if (embedding) {
      embedding.forEach((value, index) => {
        vector[index] += value;
      });
    }
  });

  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0)
  );
  if (magnitude === 0) return [...DEFAULT_VECTOR];
  return vector.map((value) => value / magnitude);
}

export async function keywordExtract(text: string): Promise<string[]> {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3 && VOCAB[token])
    )
  ).slice(0, 10);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  const dot = a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
