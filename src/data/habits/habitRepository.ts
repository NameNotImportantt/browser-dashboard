import {db} from '@/db';
import {createId, todayKey} from '@/lib';

export async function addHabit(title: string, activeWorkspaceId: string | null, position: number) {
    if (!activeWorkspaceId) {return;}

    const value = title.trim();

    if (!value) {return;}

    await db.habits.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        title: value,
        completionDates: [],
        position,
        createdAt: Date.now(),
    });
}

export async function toggleHabitToday(habitId: string) {
    const habit = await db.habits.get(habitId);

    if (!habit) {return;}

    const key = todayKey();
    const hasCompleted = habit.completionDates.includes(key);

    const completionDates = hasCompleted
        ? habit.completionDates.filter(item => item !== key)
        : [...habit.completionDates, key].sort();

    await db.habits.update(habitId, {completionDates});
}

export async function deleteHabit(habitId: string) {
    await db.habits.delete(habitId);
}
