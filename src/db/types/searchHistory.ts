export interface SearchHistoryEntry {
  id: string;
  query: string;
  normalizedQuery?: string;
  usedAt: number;
}
