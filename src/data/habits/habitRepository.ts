import {db} from '@/db';
import {createId, todayKey} from '@/lib';
import type {Habit} from '@/db';

export async function addHabit(title: string, activeWorkspaceId: string | null, position: number) {
    if (!activeWorkspaceId) {return null;}

    const value = title.trim();

    if (!value) {return null;}

    const habit: Habit = {
        id: createId(),
        workspaceId: activeWorkspaceId,
        title: value,
        completionDates: [],
        position,
        createdAt: Date.now(),
    };

    await db.habits.add(habit);

    return habit;
}

export async function toggleHabitToday(habitId: string) {
    const habit = await db.habits.get(habitId);

    if (!habit) {return null;}

    const key = todayKey();
    const hasCompleted = habit.completionDates.includes(key);

    const completionDates = hasCompleted
        ? habit.completionDates.filter(item => item !== key)
        : [...habit.completionDates, key].sort();

    await db.habits.update(habitId, {completionDates});

    return {
        ...habit,
        completionDates,
    };
}

export async function deleteHabit(habitId: string) {
    await db.habits.delete(habitId);
}
