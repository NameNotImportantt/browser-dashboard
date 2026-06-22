export interface SearchHistorySlice {
  addSearchHistoryEntry: (query: string) => Promise<void>;
}
