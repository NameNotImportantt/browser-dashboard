import clsx from 'clsx';
import {t} from '@/app';
import {MONDAY_FIRST_WEEKDAY_ORDER, WEEKDAY_ORDER_BY_LOCALE} from './constants';
import styles from './HabitMonthCalendar.module.scss';
import type {AppLocale} from '@/db';

interface HabitMonthDay {
    dateKey: string;
    dayOfMonth: number;
    completed: boolean;
    isFuture: boolean;
    isToday: boolean;
    weekday: number;
}

interface HabitMonthCalendarProps {
    locale: AppLocale;
    monthDays: HabitMonthDay[];
}

function getWeekdayFormatter(locale: AppLocale) {
    return new Intl.DateTimeFormat(locale, {weekday: 'short'});
}

function getMonthFormatter(locale: AppLocale) {
    return new Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric'});
}

function getWeekdayLabels(locale: AppLocale) {
    const weekdayOrder = WEEKDAY_ORDER_BY_LOCALE[locale] ?? MONDAY_FIRST_WEEKDAY_ORDER;
    const formatter = getWeekdayFormatter(locale);

    return weekdayOrder.map(weekday => {
        const date = new Date(2026, 0, 4 + weekday, 12);

        return formatter.format(date);
    });
}

function getMonthLabel(locale: AppLocale, monthDays: HabitMonthDay[]) {
    const [firstDay] = monthDays;

    if (!firstDay) {
        return '';
    }

    return getMonthFormatter(locale).format(new Date(`${firstDay.dateKey}T12:00:00`));
}

function getGridColumnStart(locale: AppLocale, weekday: number) {
    if (locale === 'en') {
        return weekday + 1;
    }

    return weekday === 0 ? 7 : weekday;
}

export function HabitMonthCalendar({locale, monthDays}: HabitMonthCalendarProps) {
    const weekdayLabels = getWeekdayLabels(locale);
    const monthLabel = getMonthLabel(locale, monthDays);

    return (
        <section className={styles.calendarSection}>
            <div className={styles.calendarHeader}>
                <h4 className={styles.calendarTitle}>{t(locale, 'habitMonthCalendarLabel')}</h4>

                {monthLabel ? <span className={styles.calendarMonth}>{monthLabel}</span> : null}
            </div>

            <div className={styles.weekdayRow} aria-hidden>
                {weekdayLabels.map(weekdayLabel => (
                    <span className={styles.weekdayCell} key={weekdayLabel}>
                        {weekdayLabel}
                    </span>
                ))}
            </div>

            <div className={styles.dayGrid}>
                {monthDays.map((day, index) => {
                    const dayCellClassName = clsx(
                        styles.dayCell,
                        day.completed && styles.dayCellCompleted,
                        day.isToday && styles.dayCellToday,
                        day.isFuture && styles.dayCellFuture,
                    );
                    const dayCellStyle = index === 0
                        ? {gridColumnStart: getGridColumnStart(locale, day.weekday)}
                        : undefined;

                    return (
                        <div className={dayCellClassName} key={day.dateKey} style={dayCellStyle}>
                            <span className={styles.dayNumber}>{day.dayOfMonth}</span>

                            {day.completed ? <span className={styles.completionMark} aria-hidden /> : null}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
