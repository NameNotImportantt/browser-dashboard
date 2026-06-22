import * as repository from '@/data/searchHistoryRepository';
import type {SearchHistorySlice, SliceCreator} from '../types';

export const createSearchHistorySlice: SliceCreator<SearchHistorySlice> = (_set, get) => ({
    addSearchHistoryEntry: async query => {
        await repository.addSearchHistoryEntry(query);
        await get().refresh();
    },
    deleteSearchHistoryEntry: async entryId => {
        await repository.deleteSearchHistoryEntry(entryId);
        await get().refresh();
    },
    deleteSearchHistoryEntries: async entryIds => {
        await repository.deleteSearchHistoryEntries(entryIds);
        await get().refresh();
    },
    clearSearchHistory: async () => {
        await repository.clearSearchHistory();
        await get().refresh();
    },
});
