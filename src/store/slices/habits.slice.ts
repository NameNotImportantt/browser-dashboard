import * as repository from '@/data/habitRepository';
import type {DashboardStore, HabitsSlice, SliceCreator} from '../types';

function getWorkspaceHabits(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.habits.filter(habit => habit.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

export const createHabitsSlice: SliceCreator<HabitsSlice> = (_set, get) => ({
    addHabit: async title => {
        await repository.addHabit(title, get().activeWorkspaceId, getWorkspaceHabits(get()).length);
        await get().refresh();
    },
    toggleHabitToday: async habitId => {
        await repository.toggleHabitToday(habitId);
        await get().refresh();
    },
    deleteHabit: async habitId => {
        await repository.deleteHabit(habitId);
        await get().refresh();
    },
});
