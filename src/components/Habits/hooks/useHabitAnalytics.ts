import {useMemo} from 'react';
import {getHabitStreak} from '@/data/habits';
import {todayKey} from '@/lib';
import type {Habit} from '@/db';

interface HabitMonthDay {
    dateKey: string;
    dayOfMonth: number;
    completed: boolean;
    isFuture: boolean;
    isToday: boolean;
    weekday: number;
}

interface HabitAnalytics {
    bestStreak: number;
    completedToday: boolean;
    completionRate30d: number;
    currentStreak: number;
    monthDays: HabitMonthDay[];
}

interface EnrichedHabit extends Habit {
    analytics: HabitAnalytics;
}

function createDateFromKey(dateKey: string) {
    return new Date(`${dateKey}T12:00:00`);
}

function buildBestStreak(completionDates: string[]) {
    if (completionDates.length === 0) {
        return 0;
    }

    const sortedDates = [...new Set(completionDates)].sort();

    let bestStreak = 1;
    let currentStreak = 1;

    for (let index = 1; index < sortedDates.length; index += 1) {
        const previousDateKey = sortedDates[index - 1];
        const currentDateKey = sortedDates[index];

        if (!previousDateKey || !currentDateKey) {
            continue;
        }

        const expectedNextDate = createDateFromKey(previousDateKey);

        expectedNextDate.setDate(expectedNextDate.getDate() + 1);

        if (todayKey(expectedNextDate) === currentDateKey) {
            currentStreak += 1;
            bestStreak = Math.max(bestStreak, currentStreak);
            continue;
        }

        currentStreak = 1;
    }

    return bestStreak;
}

function buildCompletionRate30d(completionSet: Set<string>, currentDate: Date) {
    let completedDays = 0;

    for (let offset = 0; offset < 30; offset += 1) {
        const cursor = new Date(currentDate);

        cursor.setDate(currentDate.getDate() - offset);

        if (completionSet.has(todayKey(cursor))) {
            completedDays += 1;
        }
    }

    return Math.round((completedDays / 30) * 100);
}

function buildMonthDays(completionSet: Set<string>, currentDate: Date, currentDateKey: string) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthDays: HabitMonthDay[] = [];

    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth += 1) {
        const date = new Date(year, month, dayOfMonth, 12);
        const dateKey = todayKey(date);

        monthDays.push({
            dateKey,
            dayOfMonth,
            completed: completionSet.has(dateKey),
            isFuture: dateKey > currentDateKey,
            isToday: dateKey === currentDateKey,
            weekday: date.getDay(),
        });
    }

    return monthDays;
}

function buildHabitAnalytics(habit: Habit, currentDateKey: string) {
    const currentDate = createDateFromKey(currentDateKey);
    const completionSet = new Set(habit.completionDates);

    return {
        bestStreak: buildBestStreak(habit.completionDates),
        completedToday: completionSet.has(currentDateKey),
        completionRate30d: buildCompletionRate30d(completionSet, currentDate),
        currentStreak: getHabitStreak(habit.completionDates, currentDateKey),
        monthDays: buildMonthDays(completionSet, currentDate, currentDateKey),
    };
}

export function useHabitAnalytics(habits: Habit[], currentDateKey = todayKey()) {
    return useMemo<EnrichedHabit[]>(
        () =>
            habits.map(habit => ({
                ...habit,
                analytics: buildHabitAnalytics(habit, currentDateKey),
            })),
        [currentDateKey, habits],
    );
}
