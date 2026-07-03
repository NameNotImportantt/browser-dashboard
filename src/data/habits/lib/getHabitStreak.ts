import {todayKey} from '@/lib';

function dateToKey(date: Date) {
    return todayKey(date);
}

export function getHabitStreak(completionDates: string[], today = todayKey()) {
    if (completionDates.length === 0) {
        return 0;
    }

    const completionSet = new Set(completionDates);
    const cursor = new Date(`${today}T12:00:00`);

    if (!completionSet.has(today)) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;

    while (completionSet.has(dateToKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}
