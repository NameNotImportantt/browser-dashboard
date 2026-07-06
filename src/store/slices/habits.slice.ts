import * as repository from '@/data/habits/habitRepository';
import {appendSnapshotCollectionItem, mapSnapshotCollectionItem, removeSnapshotCollectionItem} from '../lib/snapshotMutations';
import type {DashboardStore, HabitsSlice, SliceCreator} from '../types';

function getWorkspaceHabits(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.habits.filter(habit => habit.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

export const createHabitsSlice: SliceCreator<HabitsSlice> = (_set, get) => ({
    addHabit: async title => {
        const habit = await repository.addHabit(title, get().activeWorkspaceId, getWorkspaceHabits(get()).length);

        if (!habit) {
            return;
        }

        appendSnapshotCollectionItem(_set, 'habits', habit);
    },
    toggleHabitToday: async habitId => {
        const nextHabit = await repository.toggleHabitToday(habitId);

        if (!nextHabit) {
            return;
        }

        mapSnapshotCollectionItem(_set, 'habits', habitId, () => nextHabit);
    },
    deleteHabit: async habitId => {
        await repository.deleteHabit(habitId);
        removeSnapshotCollectionItem(_set, 'habits', habitId);
    },
});
