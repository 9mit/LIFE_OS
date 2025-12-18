
const VOCAB: Record<string, number[]> = {
  // Food & Dining
  food: [0.9, 0.1, 0.05, 0.02, 0.4, 0.7, 0.1, 0.3],
  dinner: [0.85, 0.1, 0.05, 0.02, 0.3, 0.7, 0.1, 0.3],
  lunch: [0.85, 0.1, 0.05, 0.02, 0.3, 0.7, 0.1, 0.3],
  breakfast: [0.85, 0.1, 0.05, 0.02, 0.3, 0.7, 0.1, 0.3],
  snacks: [0.8, 0.1, 0.05, 0.02, 0.3, 0.6, 0.1, 0.3],
  coffee: [0.7, 0.1, 0.05, 0.02, 0.3, 0.6, 0.1, 0.3],

  // Travel & Transport
  travel: [0.1, 0.8, 0.1, 0.2, 0.3, 0.2, 0.5, 0.4],
  uber: [0.1, 0.75, 0.1, 0.2, 0.3, 0.2, 0.5, 0.4],
  taxi: [0.1, 0.75, 0.1, 0.2, 0.3, 0.2, 0.5, 0.4],
  flight: [0.1, 0.9, 0.1, 0.2, 0.3, 0.2, 0.5, 0.4],

  // Work & Career
  work: [0.2, 0.1, 0.9, 0.6, 0.2, 0.3, 0.4, 0.3],
  meeting: [0.2, 0.1, 0.85, 0.5, 0.2, 0.3, 0.4, 0.3],
  project: [0.2, 0.1, 0.85, 0.5, 0.2, 0.3, 0.4, 0.3],
  office: [0.2, 0.1, 0.8, 0.5, 0.2, 0.3, 0.4, 0.3],

  // Health & Fitness
  health: [0.3, 0.2, 0.3, 0.9, 0.2, 0.5, 0.1, 0.5],
  fitness: [0.05, 0.2, 0.1, 0.8, 0.2, 0.4, 0.1, 0.5],
  gym: [0.1, 0.2, 0.1, 0.85, 0.2, 0.4, 0.1, 0.5],
  workout: [0.1, 0.2, 0.1, 0.8, 0.2, 0.4, 0.1, 0.5],
  run: [0.1, 0.3, 0.1, 0.7, 0.2, 0.5, 0.2, 0.6],
  exercise: [0.1, 0.2, 0.1, 0.8, 0.2, 0.4, 0.1, 0.5],

  // Mood & Emotions
  mood: [0.1, 0.1, 0.1, 0.3, 0.9, 0.2, 0.1, 0.1],
  happy: [0.1, 0.1, 0.1, 0.3, 0.85, 0.2, 0.1, 0.1],
  stressed: [0.1, 0.1, 0.1, 0.3, 0.8, 0.2, 0.1, 0.1],

  // Finance & Money
  finance: [0.8, 0.3, 0.2, 0.1, 0.6, 0.4, 0.2, 0.1],
  spending: [0.8, 0.1, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1],
  money: [0.85, 0.1, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1],
  payment: [0.8, 0.1, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1],
  amount: [0.8, 0.1, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1],

  // Family & Social
  family: [0.2, 0.1, 0.3, 0.4, 0.1, 0.6, 0.8, 0.2],
  friends: [0.2, 0.1, 0.3, 0.4, 0.1, 0.7, 0.75, 0.2],
  colleagues: [0.2, 0.2, 0.8, 0.1, 0.1, 0.3, 0.3, 0.4],

  // Study & Learning
  study: [0.1, 0.2, 0.8, 0.3, 0.1, 0.3, 0.4, 0.7],
  learn: [0.1, 0.2, 0.75, 0.3, 0.1, 0.3, 0.4, 0.7],
  course: [0.1, 0.2, 0.75, 0.3, 0.1, 0.3, 0.4, 0.7],

  // Rest & Relaxation
  rest: [0.1, 0.1, 0.2, 0.6, 0.1, 0.2, 0.5, 0.8],
  sleep: [0.1, 0.1, 0.2, 0.7, 0.1, 0.2, 0.5, 0.85],

  // Habits & Routine
  habits: [0.3, 0.2, 0.4, 0.7, 0.5, 0.6, 0.3, 0.5],
  routine: [0.3, 0.2, 0.4, 0.7, 0.5, 0.6, 0.3, 0.5],
  daily: [0.3, 0.2, 0.4, 0.6, 0.4, 0.5, 0.3, 0.5],
  weekly: [0.3, 0.2, 0.4, 0.6, 0.4, 0.5, 0.3, 0.5],

  // Analysis & Summary terms
  summary: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  summarize: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  category: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  categories: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  trend: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  forecast: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  week: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  month: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  last: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  total: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  average: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  fastest: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  grew: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  growth: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  activity: [0.4, 0.4, 0.6, 0.6, 0.4, 0.5, 0.4, 0.5],
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

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
  'me', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'you', 'he', 'she', 'it', 'we', 'they',
  'provide', 'give', 'show', 'tell', 'format', 'structured', 'please'
]);

export async function keywordExtract(text: string): Promise<string[]> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  // First prioritize vocab words, then include other meaningful words
  const vocabWords = tokens.filter((token) => VOCAB[token]);
  const otherWords = tokens.filter((token) => !VOCAB[token] && token.length > 3);

  const result = [...new Set([...vocabWords, ...otherWords])].slice(0, 10);
  return result.length > 0 ? result : tokens.slice(0, 5); // Fallback to any tokens if nothing found
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  const dot = a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
