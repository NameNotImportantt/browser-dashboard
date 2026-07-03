import {useMemo} from 'react';
import clsx from 'clsx';
import {AlertCircle, ArrowDown, Minus} from 'lucide-react';
import {useHabits, useSettings, useTodos} from '@/dashboard';
import {getHabitStreak} from '@/data/habits';
import {t} from '@/i18n';
import {todayKey} from '@/lib';
import styles from './TodayPanel.module.scss';
import type {AppLocale, TodoPriority} from '@/db';

export function TodayPanel() {
    const {todos} = useTodos();
    const {habits} = useHabits();
    const {locale} = useSettings();
    const today = todayKey();
    const todayPanelClassName = clsx('card', styles.todayPanel);
    const habitsSectionClassName = clsx(styles.section, styles.sectionSeparated);

    const activeTodos = useMemo(() => todos.filter(item => !item.completed).slice(0, 5), [todos]);

    const habitStreaks = useMemo(
        () =>
            habits.map(habit => ({
                id: habit.id,
                title: habit.title,
                streak: getHabitStreak(habit.completionDates, today),
            })),
        [habits, today],
    );

    return (
        <section className={todayPanelClassName} aria-label={t(locale, 'todayTasks')}>
            <div className={styles.columns}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t(locale, 'todayTasks')}</h2>
                    <ul className={styles.taskList}>
                        {activeTodos.length > 0 ? (
                            activeTodos.map(todo => (
                                <li key={todo.id} className={styles.taskItem}>
                                    <PriorityIcon priority={todo.priority} locale={locale} />
                                    <span>{todo.title}</span>
                                </li>
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'noActiveTasks')}</li>
                        )}
                    </ul>
                </div>

                <div className={habitsSectionClassName}>
                    <h2 className={styles.sectionTitle}>{t(locale, 'habits')}</h2>
                    <ul className={styles.habitList}>
                        {habitStreaks.length > 0 ? (
                            habitStreaks.map(habit => (
                                <li key={habit.id} className={styles.habitItem}>
                                    <span>
                                        {habit.title} — {habit.streak} {t(locale, 'days')}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'noHabits')}</li>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function PriorityIcon({priority, locale}: { priority: TodoPriority; locale: AppLocale }) {
    const label =
    priority === 'high' ? t(locale, 'priorityHigh') : priority === 'low' ? t(locale, 'priorityLow') : t(locale, 'priorityMedium');

    const highPriorityIconClassName = clsx(styles.priorityIcon, styles.priorityHigh);
    const lowPriorityIconClassName = clsx(styles.priorityIcon, styles.priorityLow);
    const mediumPriorityIconClassName = clsx(styles.priorityIcon, styles.priorityMedium);

    if (priority === 'high') {
        return (
            <span className={highPriorityIconClassName} aria-label={label} title={label}>
                <AlertCircle size={14} strokeWidth={2.25} />
            </span>
        );
    }

    if (priority === 'low') {
        return (
            <span className={lowPriorityIconClassName} aria-label={label} title={label}>
                <ArrowDown size={14} strokeWidth={2.25} />
            </span>
        );
    }

    return (
        <span className={mediumPriorityIconClassName} aria-label={label} title={label}>
            <Minus size={14} strokeWidth={2.25} />
        </span>
    );
}
