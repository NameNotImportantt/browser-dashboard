import {useMemo} from 'react';
import {useHabits} from '@/dashboard';
import {getHabitStreak} from '@/data/habits';
import {todayKey} from '@/lib';
import type {Habit} from '@/db';

export interface TodayPanelHabitItem {
    id: string;
    title: string;
    streak: number;
    completedToday: boolean;
}

export function useTodayPanelHabits() {
    const {habits, toggleHabitToday} = useHabits();
    const today = todayKey();

    const habitRows = useMemo(
        () => habits.map(habit => buildTodayPanelHabitItem(habit, today)),
        [habits, today],
    );

    return {
        habitRows,
        toggleHabitToday,
    };
}

function buildTodayPanelHabitItem(habit: Habit, today: string): TodayPanelHabitItem {
    return {
        id: habit.id,
        title: habit.title,
        streak: getHabitStreak(habit.completionDates, today),
        completedToday: habit.completionDates.includes(today),
    };
}
