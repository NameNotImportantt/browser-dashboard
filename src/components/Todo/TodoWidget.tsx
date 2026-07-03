import {useMemo, useState, type ChangeEvent, type FormEvent} from 'react';
import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles, useFieldValidation} from '@/components';
import {Select} from '@/components/Select';
import {useSettings, useTodos} from '@/dashboard';
import {t} from '@/i18n';
import {TodoFilters} from './components/TodoFilters/TodoFilters';
import {TodoListItem} from './components/TodoListItem/TodoListItem';
import {useTodoFilters} from './hooks/useTodoFilters';
import {reorderIds} from './lib/reorderIds';
import styles from './TodoWidget.module.scss';
import type {TodoPriority} from '@/db';

export function TodoWidget() {
    const {todos, addTodo, toggleTodo, deleteTodo, reorderTodos} = useTodos();
    const {locale} = useSettings();
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TodoPriority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const titleValidation = useFieldValidation();

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
    const titleInputClassName = clsx(styles.inputField, titleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);
    const isEmptyTodoList = todos.length === 0;
    const emptyMessage = isEmptyTodoList ? t(locale, 'todoEmpty') : t(locale, 'todoFilteredEmpty');

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

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        titleValidation.clearError();
    };

    const handlePriorityChange = (value: string) => {
        setPriority(value as TodoPriority);
    };

    const handleDueDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDueDate(event.target.value);
    };

    const handleTodoToggle = (todoId: string) => {
        void toggleTodo(todoId);
    };

    const handleTodoDelete = (todoId: string) => {
        void deleteTodo(todoId);
    };

    const handleTodoDragStart = (todoId: string) => {
        setDraggedId(todoId);
    };

    const handleTodoDrop = (todoId: string) => {
        void dropOn(todoId);
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            titleValidation.markSubmitted();
            titleValidation.setError(t(locale, 'todoTitleRequired'));
            return;
        }

        await addTodo({
            title,
            priority,
            dueDate: dueDate || null,
        });
        setTitle('');
        setDueDate('');
        titleValidation.reset();
    };

    return (
        <section className={todoWidgetClassName}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navTodo')}</h2>
            </header>

            <form className={styles.stackForm} onSubmit={submit}>
                <input
                    className={titleInputClassName}
                    value={title}
                    onChange={handleTitleChange}
                    placeholder={t(locale, 'todoNewPlaceholder')}
                    aria-label={t(locale, 'todoNewPlaceholder')}
                    {...titleValidation.getAriaProps()}
                />

                <div className={styles.inlineRow}>
                    <Select
                        className={styles.inlineRowField}
                        value={priority}
                        options={priorityOptions}
                        onChange={handlePriorityChange}
                        ariaLabel={t(locale, 'todoPriority')}
                    />

                    <input
                        className={styles.inlineRowField}
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateChange}
                        aria-label={t(locale, 'todoDueDateAriaLabel')}
                    />
                </div>

                <button className="primary" type="submit">
                    {t(locale, 'todoAdd')}
                </button>

                <FieldValidationMessage
                    className={styles.formError}
                    id={titleValidation.messageId}
                    message={titleValidation.showError ? titleValidation.validation.error : null}
                />
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
                        onToggle={handleTodoToggle}
                        onDelete={handleTodoDelete}
                        onDragStart={handleTodoDragStart}
                        onDrop={handleTodoDrop}
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
