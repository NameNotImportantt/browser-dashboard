import {useMemo, useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {reorderIds, t} from '@/app';
import {Select} from '@/components/Select';
import {useSettings, useTodos} from '@/dashboard';
import {TodoFilters} from './components/TodoFilters/TodoFilters';
import {TodoListItem} from './components/TodoListItem/TodoListItem';
import {useTodoFilters} from './hooks/useTodoFilters';
import styles from './TodoWidget.module.scss';
import type {TodoPriority} from '@/db';

export function TodoWidget() {
    const {todos, addTodo, toggleTodo, deleteTodo, reorderTodos} = useTodos();
    const {locale} = useSettings();
    const [title, setTitle] = useState('');
    const [todoError, setTodoError] = useState<string | null>(null);
    const [priority, setPriority] = useState<TodoPriority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const priorityOptions = useMemo(
        () => [
            {value: 'low', label: t(locale, 'priorityLow')},
            {value: 'medium', label: t(locale, 'priorityMedium')},
            {value: 'high', label: t(locale, 'priorityHigh')},
        ],
        [locale],
    );

    const {
        dateFilter,
        setDateFilter,
        dateFilterOptions,
        statusFilter,
        setStatusFilter,
        statusFilterOptions,
        priorityFilter,
        setPriorityFilter,
        priorityFilterOptions,
        filteredTodos,
    } = useTodoFilters(todos, locale);

    const filteredTodoIds = useMemo(() => filteredTodos.map(todo => todo.id), [filteredTodos]);

    const todoWidgetClassName = clsx('card', styles.todoWidget);
    const todoListClassName = clsx(styles.widgetList, styles.todoList);
    const isEmptyTodoList = todos.length === 0;
    const emptyMessage = isEmptyTodoList ? t(locale, 'todoEmpty') : t(locale, 'todoFilteredEmpty');

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            setTodoError(t(locale, 'todoTitleRequired'));
            return;
        }

        await addTodo({
            title,
            priority,
            dueDate: dueDate || null,
        });
        setTitle('');
        setDueDate('');
        setTodoError(null);
    };

    const dropOn = async (targetId: string) => {
        if (!draggedId || draggedId === targetId) {return;}

        const reorderedVisibleTodoIds = reorderIds(filteredTodoIds, draggedId, targetId);

        const orderedTodoIds = mergeFilteredTodoOrder(
            todos.map(todo => todo.id),
            filteredTodoIds,
            reorderedVisibleTodoIds,
        );

        setDraggedId(null);
        await reorderTodos(orderedTodoIds);
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
                    onChange={event => {
                        setTitle(event.target.value);
                        setTodoError(null);
                    }}
                    placeholder={t(locale, 'todoNewPlaceholder')}
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
                {todoError ? <small className={styles.formError}>{todoError}</small> : null}
            </form>

            <TodoFilters
                locale={locale}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                dateFilterOptions={dateFilterOptions}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                priorityFilterOptions={priorityFilterOptions}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                statusFilterOptions={statusFilterOptions}
            />

            <ul className={todoListClassName}>
                {filteredTodos.length > 0 ? filteredTodos.map(todo => (
                    <TodoListItem
                        key={todo.id}
                        todo={todo}
                        locale={locale}
                        onToggle={todoId => {
                            void toggleTodo(todoId);
                        }}
                        onDelete={todoId => {
                            void deleteTodo(todoId);
                        }}
                        onDragStart={todoId => setDraggedId(todoId)}
                        onDrop={todoId => {
                            void dropOn(todoId);
                        }}
                    />
                )) : <li className={styles.emptyState}>{emptyMessage}</li>}
            </ul>
        </section>
    );
}

function mergeFilteredTodoOrder(allTodoIds: string[], visibleTodoIds: string[], reorderedVisibleTodoIds: string[]) {
    const visibleTodoIdSet = new Set(visibleTodoIds);
    const reorderedVisibleTodoQueue = [...reorderedVisibleTodoIds];

    return allTodoIds.map(todoId => {
        if (!visibleTodoIdSet.has(todoId)) {
            return todoId;
        }

        const nextVisibleTodoId = reorderedVisibleTodoQueue.shift();

        return nextVisibleTodoId ?? todoId;
    });
}
