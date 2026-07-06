import {useMemo} from 'react';
import {useDashboardStore} from '@/store';

export function useSearchHistory() {
    const searchHistoryCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.searchHistory ?? []);
    const searchHistory = useMemo(() => searchHistoryCollection, [searchHistoryCollection]);
    const addSearchHistoryEntry = useDashboardStore(dashboardStore => dashboardStore.addSearchHistoryEntry);
    const deleteSearchHistoryEntry = useDashboardStore(dashboardStore => dashboardStore.deleteSearchHistoryEntry);
    const deleteSearchHistoryEntries = useDashboardStore(dashboardStore => dashboardStore.deleteSearchHistoryEntries);
    const clearSearchHistory = useDashboardStore(dashboardStore => dashboardStore.clearSearchHistory);

    return {
        searchHistory,
        addSearchHistoryEntry,
        deleteSearchHistoryEntry,
        deleteSearchHistoryEntries,
        clearSearchHistory,
    };
}
