import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';
import {selectSortedWorkspaceScopedItems} from './lib/workspaceCollections';

export function useHabits() {
    const habitsCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.habits ?? []);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const habits = useMemo(
        () => selectSortedWorkspaceScopedItems(habitsCollection, activeWorkspaceId),
        [activeWorkspaceId, habitsCollection],
    );
    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            addHabit: dashboardStore.addHabit,
            toggleHabitToday: dashboardStore.toggleHabitToday,
            deleteHabit: dashboardStore.deleteHabit,
        })),
    );

    return {habits, ...actions};
}
