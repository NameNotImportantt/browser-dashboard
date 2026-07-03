import {useMemo, useState} from 'react';
import clsx from 'clsx';
import {AlertCircle, ArrowDown, Flame, ListTodo, Minus} from 'lucide-react';
import {Checkbox} from '@/components/Checkbox';
import {useHabits, useSettings, useTodos} from '@/dashboard';
import {getHabitStreak} from '@/data/habits';
import {t} from '@/i18n';
import {todayKey} from '@/lib';
import styles from './TodayPanel.module.scss';
import type {AppLocale, Habit, TodoItem, TodoPriority} from '@/db';

export function TodayPanel() {
    const {todos, toggleTodo} = useTodos();
    const {habits, toggleHabitToday} = useHabits();
    const {locale} = useSettings();
    const [showCompleted, setShowCompleted] = useState(false);
    const today = todayKey();
    const todayPanelClassName = clsx('card', styles.todayPanel);
    const habitsSectionClassName = clsx(styles.section, styles.sectionSeparated);
    const taskToggleLabel = t(locale, 'todayTasksShowCompleted');

    const panelTodos = useMemo(
        () => buildTodayPanelTodos(todos, today, showCompleted),
        [showCompleted, today, todos],
    );

    const habitRows = useMemo(
        () =>
            habits.map(habit => buildTodayPanelHabit(habit, today)),
        [habits, today],
    );

    const handleShowCompletedChange = () => {
        setShowCompleted(currentShowCompleted => !currentShowCompleted);
    };

    const handleTodoToggle = (todoId: string) => {
        void toggleTodo(todoId);
    };

    const handleHabitToggle = (habitId: string) => {
        void toggleHabitToday(habitId);
    };

    return (
        <section className={todayPanelClassName} aria-label={t(locale, 'todayTasks')}>
            <div className={styles.panelContent}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <ListTodo className={styles.sectionIcon} size={15} strokeWidth={2.2} />
                            <h2 className={styles.sectionTitle}>{t(locale, 'todayTasks')}</h2>
                        </div>

                        <Checkbox
                            checked={showCompleted}
                            onChange={handleShowCompletedChange}
                            className={styles.sectionToggle}
                            label={<span className={styles.sectionToggleLabel}>{taskToggleLabel}</span>}
                        />
                    </div>

                    <ul className={styles.taskList}>
                        {panelTodos.length > 0 ? (
                            panelTodos.map(todo => (
                                <TaskRow
                                    key={todo.id}
                                    todo={todo}
                                    today={today}
                                    locale={locale}
                                    onToggle={handleTodoToggle}
                                />
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'todayTasksEmpty')}</li>
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
                        {habitRows.length > 0 ? (
                            habitRows.map(habit => (
                                <HabitRow
                                    key={habit.id}
                                    habit={habit}
                                    locale={locale}
                                    onToggle={handleHabitToggle}
                                />
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
    todo: TodoItem;
    today: string;
    locale: AppLocale;
    onToggle: (todoId: string) => void;
};

function TaskRow({todo, today, locale, onToggle}: TaskRowProps) {
    const rowSurfaceClassName = clsx(
        styles.rowSurface,
        todo.completed && styles.rowSurfaceCompleted,
    );
    const rowTitleClassName = clsx(
        styles.rowTitle,
        todo.completed && styles.rowTitleCompleted,
    );
    const rowSubtitleClassName = clsx(
        styles.rowSubtitle,
        todo.completed && styles.rowSubtitleCompleted,
        todo.dueDate !== null && todo.dueDate < today && styles.rowSubtitleOverdue,
    );

    const checkboxLabel = <span className={styles.visuallyHidden}>{todo.title}</span>;

    const handleToggle = () => {
        onToggle(todo.id);
    };

    return (
        <li className={styles.taskItem}>
            <div className={rowSurfaceClassName}>
                <Checkbox
                    checked={todo.completed}
                    onChange={handleToggle}
                    className={styles.taskCheckbox}
                    label={checkboxLabel}
                />

                <div className={styles.rowBody}>
                    <span className={rowTitleClassName}>{todo.title}</span>

                    {todo.dueDate ? <span className={rowSubtitleClassName}>{todo.dueDate}</span> : null}
                </div>

                <div className={styles.rowMeta}>
                    <PriorityBadge priority={todo.priority} locale={locale} />
                </div>
            </div>
        </li>
    );
}

type HabitRowProps = {
    habit: TodayPanelHabit;
    locale: AppLocale;
    onToggle: (habitId: string) => void;
};

function HabitRow({habit, locale, onToggle}: HabitRowProps) {
    const rowSurfaceClassName = clsx(
        styles.rowSurface,
        habit.completedToday && styles.rowSurfaceHabitCompleted,
    );
    const checkboxLabel = (
        <span className={styles.visuallyHidden}>
            {getHabitCheckboxLabel(habit.completedToday, habit.title, locale)}
        </span>
    );

    const handleToggle = () => {
        onToggle(habit.id);
    };

    return (
        <li className={styles.habitItem}>
            <div className={rowSurfaceClassName}>
                <Checkbox
                    checked={habit.completedToday}
                    onChange={handleToggle}
                    className={styles.habitCheckbox}
                    label={checkboxLabel}
                />

                <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{habit.title}</span>
                </div>

                <div className={styles.rowMeta}>
                    <span className={styles.streakBadge}>
                        <Flame size={13} strokeWidth={2.2} />
                        <span>
                            {habit.streak} {t(locale, 'days')}
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

type TodayPanelHabit = {
    id: string;
    title: string;
    streak: number;
    completedToday: boolean;
};

function buildTodayPanelHabit(habit: Habit, today: string): TodayPanelHabit {
    return {
        id: habit.id,
        title: habit.title,
        streak: getHabitStreak(habit.completionDates, today),
        completedToday: habit.completionDates.includes(today),
    };
}

function getHabitCheckboxLabel(completedToday: boolean, title: string, locale: AppLocale) {
    const actionLabel = completedToday ? t(locale, 'habitUnmarkToday') : t(locale, 'habitMarkToday');

    return `${actionLabel}: ${title}`;
}

function buildTodayPanelTodos(todos: TodoItem[], today: string, showCompleted: boolean) {
    const filteredTodos = todos.filter(todo => isTodayPanelTodo(todo, today));

    const sortedTodos = [...filteredTodos].sort((firstTodo, secondTodo) => (
        getTodayPanelTodoRank(firstTodo, today) - getTodayPanelTodoRank(secondTodo, today)
    ));

    if (!showCompleted) {
        return sortedTodos.filter(todo => !todo.completed);
    }

    return sortedTodos.slice(0, 10);
}

function isTodayPanelTodo(todo: TodoItem, today: string) {
    if (todo.dueDate === null) {
        return false;
    }

    return todo.dueDate <= today;
}

function getTodayPanelTodoRank(todo: TodoItem, today: string) {
    if (todo.completed) {
        return todo.dueDate === today ? 2 : 3;
    }

    return todo.dueDate === today ? 0 : 1;
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
