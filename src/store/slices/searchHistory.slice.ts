import * as repository from '@/data/searchHistoryRepository';
import type {SearchHistorySlice, SliceCreator} from '../types';

export const createSearchHistorySlice: SliceCreator<SearchHistorySlice> = (_set, get) => ({
    addSearchHistoryEntry: async query => {
        await repository.addSearchHistoryEntry(query);
        await get().refresh();
    },
});
