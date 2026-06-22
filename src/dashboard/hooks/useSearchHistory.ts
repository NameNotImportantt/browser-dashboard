import {useMemo} from 'react';
import {useDashboardStore} from '@/store';

export function useSearchHistory() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const searchHistory = useMemo(() => snapshot?.searchHistory ?? [], [snapshot]);
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
