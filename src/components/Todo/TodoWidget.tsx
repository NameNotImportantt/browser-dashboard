import {useMemo, useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {reorderIds, t} from '@/app';
import {Checkbox} from '@/components/Checkbox';
import {Select} from '@/components/Select';
import {useSettings, useTodos} from '@/dashboard';
import styles from './TodoWidget.module.scss';
import type {AppLocale, TodoPriority} from '@/db';

export function TodoWidget() {
    const {todos, addTodo, toggleTodo, deleteTodo, reorderTodos} = useTodos();
    const {locale} = useSettings();
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TodoPriority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const todoIds = useMemo(() => todos.map(item => item.id), [todos]);

    const priorityOptions = useMemo(
        () => [
            {value: 'low', label: t(locale, 'priorityLow')},
            {value: 'medium', label: t(locale, 'priorityMedium')},
            {value: 'high', label: t(locale, 'priorityHigh')},
        ],
        [locale],
    );

    const todoWidgetClassName = clsx('card', styles.todoWidget);
    const todoListClassName = clsx(styles.widgetList, styles.todoList);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addTodo({
            title,
            priority,
            dueDate: dueDate || null,
        });
        setTitle('');
        setDueDate('');
    };

    const dropOn = async (targetId: string) => {
        if (!draggedId || draggedId === targetId) {return;}

        const ordered = reorderIds(todoIds, draggedId, targetId);

        setDraggedId(null);
        await reorderTodos(ordered);
    };

    return (
        <section className={todoWidgetClassName}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navTodo')}</h2>
            </header>

            <form className={styles.stackForm} onSubmit={submit}>
                <input
                    className={styles.inputField}
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder={t(locale, 'todoNewPlaceholder')}
                    required
                />
                <div className={styles.inlineRow}>
                    <Select
                        className={styles.inlineRowField}
                        value={priority}
                        options={priorityOptions}
                        onChange={value => setPriority(value as TodoPriority)}
                        ariaLabel={t(locale, 'todoPriority')}
                    />
                    <input
                        className={styles.inlineRowField}
                        type="date"
                        value={dueDate}
                        onChange={event => setDueDate(event.target.value)}
                        aria-label={t(locale, 'todoDueDateAriaLabel')}
                    />
                </div>
                <button className="primary" type="submit">
                    {t(locale, 'todoAdd')}
                </button>
            </form>

            <ul className={todoListClassName}>
                {todos.map(todo => {
                    const todoItemClassName = clsx(styles.todoItem, priorityItemClass(todo.priority));
                    const todoTitleClassName = clsx({[styles.isCompleted]: todo.completed});
                    const todoPriorityBadgeClassName = clsx(styles.todoBadge, priorityBadgeClass(todo.priority));

                    return (
                        <li
                            className={todoItemClassName}
                            key={todo.id}
                            draggable
                            onDragStart={() => setDraggedId(todo.id)}
                            onDragOver={event => event.preventDefault()}
                            onDrop={() => {
                                void dropOn(todo.id);
                            }}
                        >
                            <Checkbox
                                className={styles.todoLabel}
                                checked={todo.completed}
                                onChange={() => void toggleTodo(todo.id)}
                                label={<span className={todoTitleClassName}>{todo.title}</span>}
                            />

                            <div className={styles.todoMeta}>
                                <small className={todoPriorityBadgeClassName}>{priorityLabel(todo.priority, locale)}</small>
                                {todo.dueDate ? <small className={styles.todoBadge}>{todo.dueDate}</small> : null}
                                <button type="button" className={styles.dangerButton} onClick={() => void deleteTodo(todo.id)}>
                                    {t(locale, 'remove')}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function priorityItemClass(priority: TodoPriority) {
    if (priority === 'high') {return styles.priorityHigh;}

    if (priority === 'low') {return styles.priorityLow;}

    return styles.priorityMedium;
}

function priorityBadgeClass(priority: TodoPriority) {
    if (priority === 'high') {return styles.badgeHigh;}

    if (priority === 'low') {return styles.badgeLow;}

    return styles.badgeMedium;
}

function priorityLabel(priority: TodoPriority, locale: AppLocale) {
    if (priority === 'high') {return t(locale, 'priorityHigh');}

    if (priority === 'low') {return t(locale, 'priorityLow');}

    return t(locale, 'priorityMedium');
}
