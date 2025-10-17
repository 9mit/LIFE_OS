
export function normalizeValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gi, " ").trim();
}

export function parseDateGuess(row: Record<string, unknown>): number {
  const DATE_KEYS = ["date", "timestamp", "created_at", "time", "day"];
  for (const key of Object.keys(row)) {
    if (DATE_KEYS.some((dateKey) => key.toLowerCase().includes(dateKey))) {
      const value = row[key];
      if (typeof value === 'string' || typeof value === 'number') {
        const parsed = Date.parse(String(value));
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    }
  }
  return Date.now();
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(number);
}

export function groupBy<T,>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = key(item);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
}

export function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}
