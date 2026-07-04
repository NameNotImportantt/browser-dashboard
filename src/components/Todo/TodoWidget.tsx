import {useMemo} from 'react';
import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles} from '@/components';
import {Select} from '@/components/Select';
import {useSettings, useTodos} from '@/dashboard';
import {t} from '@/i18n';
import {TodoFilters} from './components/TodoFilters/TodoFilters';
import {TodoListItem} from './components/TodoListItem/TodoListItem';
import {useTodoFilters} from './hooks/useTodoFilters';
import {useTodoWidgetController} from './hooks/useTodoWidgetController';
import styles from './TodoWidget.module.scss';
import type {TodoPriority} from '@/db';

export function TodoWidget() {
    const {todos} = useTodos();
    const {locale} = useSettings();

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
    const {
        dueDate,
        emptyMessage,
        handleDeleteTodo,
        handleDropTodo,
        handleDueDateChange,
        handlePriorityChange,
        handleTitleChange,
        handleToggleTodo,
        priority,
        priorityOptions,
        setDraggedId,
        submit,
        title,
        titleValidation,
    } = useTodoWidgetController(filteredTodoIds);

    const todoWidgetClassName = clsx('card', styles.todoWidget);
    const todoListClassName = clsx(styles.widgetList, styles.todoList);
    const titleInputClassName = clsx(styles.inputField, titleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);

    return (
        <section className={todoWidgetClassName}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navTodo')}</h2>
            </header>

            <form className={styles.stackForm} onSubmit={submit}>
                <input
                    className={titleInputClassName}
                    value={title}
                    onChange={event => handleTitleChange(event.target.value)}
                    placeholder={t(locale, 'todoNewPlaceholder')}
                    aria-label={t(locale, 'todoNewPlaceholder')}
                    {...titleValidation.getAriaProps()}
                />

                <div className={styles.inlineRow}>
                    <Select
                        className={styles.inlineRowField}
                        value={priority}
                        options={priorityOptions}
                        onChange={value => handlePriorityChange(value as TodoPriority)}
                        ariaLabel={t(locale, 'todoPriority')}
                    />

                    <input
                        className={styles.inlineRowField}
                        type="date"
                        value={dueDate}
                        onChange={event => handleDueDateChange(event.target.value)}
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
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onDragStart={todoId => setDraggedId(todoId)}
                        onDrop={handleDropTodo}
                    />
                )) : <li className={styles.emptyState}>{emptyMessage}</li>}
            </ul>
        </section>
    );
}
