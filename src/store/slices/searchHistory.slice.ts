import * as repository from '@/data/searchHistory/searchHistoryRepository';
import {createSnapshotFieldReload} from '../lib/createSnapshotFieldReload';
import {UndoActionKind, type SearchHistorySlice, type SliceCreator} from '../types';

export const createSearchHistorySlice: SliceCreator<SearchHistorySlice> = (set, get) => {
    const reloadSearchHistory = createSnapshotFieldReload(set, 'searchHistory', repository.listSearchHistoryEntries);

    return {
        addSearchHistoryEntry: async query => {
            await repository.addSearchHistoryEntry(query);
            await reloadSearchHistory();
        },
        deleteSearchHistoryEntry: async entryId => {
            const entry = get().snapshot?.searchHistory.find(searchHistoryEntry => searchHistoryEntry.id === entryId) ?? null;

            await repository.deleteSearchHistoryEntry(entryId);

            if (entry) {
                get().enqueueUndoEntry({
                    kind: UndoActionKind.SearchHistoryDelete,
                    entries: [entry],
                    clearedAll: false,
                });
            }

            await reloadSearchHistory();
        },
        deleteSearchHistoryEntries: async entryIds => {
            const entries = (get().snapshot?.searchHistory ?? []).filter(searchHistoryEntry => entryIds.includes(searchHistoryEntry.id));

            await repository.deleteSearchHistoryEntries(entryIds);

            if (entries.length > 0) {
                get().enqueueUndoEntry({
                    kind: UndoActionKind.SearchHistoryDelete,
                    entries,
                    clearedAll: false,
                });
            }

            await reloadSearchHistory();
        },
        clearSearchHistory: async () => {
            const entries = get().snapshot?.searchHistory ?? [];

            await repository.clearSearchHistory();

            if (entries.length > 0) {
                get().enqueueUndoEntry({
                    kind: UndoActionKind.SearchHistoryDelete,
                    entries,
                    clearedAll: true,
                });
            }

            await reloadSearchHistory();
        },
    };
};
