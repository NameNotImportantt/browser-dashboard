export interface SearchHistorySlice {
  addSearchHistoryEntry: (query: string) => Promise<void>;
  deleteSearchHistoryEntry: (entryId: string) => Promise<void>;
  deleteSearchHistoryEntries: (entryIds: string[]) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
}
