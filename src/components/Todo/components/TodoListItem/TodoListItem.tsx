import clsx from 'clsx';
import {t} from '@/app';
import {Checkbox} from '@/components/Checkbox';
import styles from './TodoListItem.module.scss';
import type {AppLocale, TodoItem, TodoPriority} from '@/db';

type TodoListItemProps = {
    todo: TodoItem;
    locale: AppLocale;
    onToggle: (todoId: string) => void;
    onDelete: (todoId: string) => void;
    onDragStart: (todoId: string) => void;
    onDrop: (todoId: string) => void;
};

export function TodoListItem({todo, locale, onToggle, onDelete, onDragStart, onDrop}: TodoListItemProps) {
    const todoItemClassName = clsx(styles.todoItem, getPriorityItemClass(todo.priority));
    const todoTitleClassName = clsx({[styles.isCompleted]: todo.completed});
    const todoPriorityBadgeClassName = clsx(styles.todoBadge, getPriorityBadgeClass(todo.priority));

    return (
        <li
            className={todoItemClassName}
            draggable
            onDragStart={() => onDragStart(todo.id)}
            onDragOver={event => event.preventDefault()}
            onDrop={() => onDrop(todo.id)}
        >
            <Checkbox
                className={styles.todoLabel}
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                label={<span className={todoTitleClassName}>{todo.title}</span>}
            />

            <div className={styles.todoMeta}>
                <small className={todoPriorityBadgeClassName}>{getPriorityLabel(todo.priority, locale)}</small>
                {todo.dueDate ? <small className={styles.todoBadge}>{todo.dueDate}</small> : null}
                <button type="button" className={styles.dangerButton} onClick={() => onDelete(todo.id)}>
                    {t(locale, 'remove')}
                </button>
            </div>
        </li>
    );
}

function getPriorityItemClass(priority: TodoPriority) {
    if (priority === 'high') {return styles.priorityHigh;}

    if (priority === 'low') {return styles.priorityLow;}

    return styles.priorityMedium;
}

function getPriorityBadgeClass(priority: TodoPriority) {
    if (priority === 'high') {return styles.badgeHigh;}

    if (priority === 'low') {return styles.badgeLow;}

    return styles.badgeMedium;
}

function getPriorityLabel(priority: TodoPriority, locale: AppLocale) {
    if (priority === 'high') {return t(locale, 'priorityHigh');}

    if (priority === 'low') {return t(locale, 'priorityLow');}

    return t(locale, 'priorityMedium');
}
