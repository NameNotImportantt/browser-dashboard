import clsx from 'clsx';
import {AlertCircle, ArrowDown, Minus} from 'lucide-react';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {todayKey} from '@/lib';
import styles from './TodayTaskRow.module.scss';
import type {AppLocale, TodoItem, TodoPriority} from '@/db';

type TodayTaskRowProps = {
    todo: TodoItem;
    onToggle: (todoId: string) => void;
};

export function TodayTaskRow({todo, onToggle}: TodayTaskRowProps) {
    const {locale} = useSettings();
    const today = todayKey();

    const rowSurfaceClassName = clsx(
        styles.taskRowSurface,
        todo.completed && styles.taskRowSurfaceCompleted,
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
        <li className={styles.taskRow}>
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

function PriorityBadge({priority, locale}: { priority: TodoPriority; locale: AppLocale }) {
    const rowBadgeClassName = clsx(styles.rowBadge, getPriorityBadgeClass(priority));

    return (
        <span className={rowBadgeClassName}>
            <PriorityIcon priority={priority} locale={locale} />

            <span>{getPriorityLabel(priority, locale)}</span>
        </span>
    );
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
