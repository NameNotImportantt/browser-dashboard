import {useMemo} from 'react';
import clsx from 'clsx';
import {AlertCircle, ArrowDown, Flame, ListTodo, Minus} from 'lucide-react';
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
            <div className={styles.panelContent}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <ListTodo className={styles.sectionIcon} size={15} strokeWidth={2.2} />
                            <h2 className={styles.sectionTitle}>{t(locale, 'todayTasks')}</h2>
                        </div>
                    </div>

                    <ul className={styles.taskList}>
                        {activeTodos.length > 0 ? (
                            activeTodos.map(todo => (
                                <TaskRow key={todo.id} title={todo.title} priority={todo.priority} locale={locale} />
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'noActiveTasks')}</li>
                        )}
                    </ul>
                </div>

                <div className={habitsSectionClassName}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <Flame className={styles.sectionIcon} size={15} strokeWidth={2.2} />
                            <h2 className={styles.sectionTitle}>{t(locale, 'habits')}</h2>
                        </div>
                    </div>

                    <ul className={styles.habitList}>
                        {habitStreaks.length > 0 ? (
                            habitStreaks.map(habit => (
                                <HabitRow key={habit.id} title={habit.title} streak={habit.streak} locale={locale} />
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

type TaskRowProps = {
    title: string;
    priority: TodoPriority;
    locale: AppLocale;
};

function TaskRow({title, priority, locale}: TaskRowProps) {
    return (
        <li className={styles.taskItem}>
            <div className={styles.rowSurface}>
                <span className={clsx(styles.rowControl, styles.rowControlTask)} aria-hidden />

                <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{title}</span>
                </div>

                <div className={styles.rowMeta}>
                    <PriorityBadge priority={priority} locale={locale} />
                </div>
            </div>
        </li>
    );
}

type HabitRowProps = {
    title: string;
    streak: number;
    locale: AppLocale;
};

function HabitRow({title, streak, locale}: HabitRowProps) {
    return (
        <li className={styles.habitItem}>
            <div className={styles.rowSurface}>
                <span className={clsx(styles.rowControl, styles.rowControlHabit)} aria-hidden />

                <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{title}</span>
                </div>

                <div className={styles.rowMeta}>
                    <span className={styles.streakBadge}>
                        <Flame size={13} strokeWidth={2.2} />
                        <span>
                            {streak} {t(locale, 'days')}
                        </span>
                    </span>
                </div>
            </div>
        </li>
    );
}

function PriorityBadge({priority, locale}: { priority: TodoPriority; locale: AppLocale }) {
    const rowBadgeClassName = clsx(styles.rowBadge, getPriorityBadgeClass(priority));

    return (
        <span className={rowBadgeClassName}>
            <PriorityIcon priority={priority} locale={locale} />
            <span>{getPriorityLabel(priority, locale)}</span>
        </span>
    );
}

function getPriorityBadgeClass(priority: TodoPriority) {
    if (priority === 'high') {return styles.rowBadgeHigh;}

    if (priority === 'low') {return styles.rowBadgeLow;}

    return styles.rowBadgeMedium;
}

function getPriorityLabel(priority: TodoPriority, locale: AppLocale) {
    if (priority === 'high') {return t(locale, 'priorityHigh');}

    if (priority === 'low') {return t(locale, 'priorityLow');}

    return t(locale, 'priorityMedium');
}

function PriorityIcon({priority, locale}: { priority: TodoPriority; locale: AppLocale }) {
    const label = getPriorityLabel(priority, locale);

    const priorityIconClassName = clsx(
        styles.priorityIcon,
        priority === 'high' && styles.priorityHigh,
        priority === 'low' && styles.priorityLow,
        priority === 'medium' && styles.priorityMedium,
    );

    if (priority === 'high') {
        return (
            <span className={priorityIconClassName} aria-label={label} title={label}>
                <AlertCircle size={14} strokeWidth={2.25} />
            </span>
        );
    }

    if (priority === 'low') {
        return (
            <span className={priorityIconClassName} aria-label={label} title={label}>
                <ArrowDown size={14} strokeWidth={2.25} />
            </span>
        );
    }

    return (
        <span className={priorityIconClassName} aria-label={label} title={label}>
            <Minus size={14} strokeWidth={2.25} />
        </span>
    );
}
