import {useMemo} from 'react';
import {useDashboardStore} from '@/store';

export function useSearchHistory() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const searchHistory = useMemo(() => snapshot?.searchHistory ?? [], [snapshot]);
    const addSearchHistoryEntry = useDashboardStore(dashboardStore => dashboardStore.addSearchHistoryEntry);

    return {searchHistory, addSearchHistoryEntry};
}
