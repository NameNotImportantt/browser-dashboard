import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useHabits() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const habits = useMemo(() => {
        if (!activeWorkspaceId) {return [];}

        return [...(snapshot?.habits.filter(habit => habit.workspaceId === activeWorkspaceId) ?? [])].sort(
            (firstHabit, secondHabit) => firstHabit.position - secondHabit.position,
        );
    }, [activeWorkspaceId, snapshot]);
    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            addHabit: dashboardStore.addHabit,
            toggleHabitToday: dashboardStore.toggleHabitToday,
            deleteHabit: dashboardStore.deleteHabit,
        })),
    );

    return {habits, ...actions};
}
