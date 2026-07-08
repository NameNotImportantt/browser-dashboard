import {useMemo} from 'react';
import clsx from 'clsx';
import {Filter} from 'lucide-react';
import {FieldValidationMessage, IconButton, fieldValidationStyles} from '@/components';
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
        filtersVisible,
        toggleFiltersVisible,
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

    const filtersToggleButtonClassName = clsx(
        styles.filtersToggleButton,
        filtersVisible && styles.filtersToggleButtonActive,
    );

    const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleTitleChange(event.target.value);
    };

    const handlePrioritySelectChange = (value: string) => {
        handlePriorityChange(value as TodoPriority);
    };

    const handleDueDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleDueDateChange(event.target.value);
    };

    const handleFiltersToggleButtonClick = () => {
        toggleFiltersVisible();
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
                    onChange={handleTitleInputChange}
                    placeholder={t(locale, 'todoNewPlaceholder')}
                    aria-label={t(locale, 'todoNewPlaceholder')}
                    {...titleValidation.getAriaProps()}
                />

                <div className={styles.inlineRow}>
                    <Select
                        className={styles.inlineRowField}
                        value={priority}
                        options={priorityOptions}
                        onChange={handlePrioritySelectChange}
                        ariaLabel={t(locale, 'todoPriority')}
                    />

                    <input
                        className={styles.inlineRowField}
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateInputChange}
                        aria-label={t(locale, 'todoDueDateAriaLabel')}
                    />
                </div>

                <div className={styles.actionsRow}>
                    <button className="primary" type="submit">
                        {t(locale, 'todoAdd')}
                    </button>
                    <IconButton
                        className={filtersToggleButtonClassName}
                        withChrome={false}
                        onClick={handleFiltersToggleButtonClick}
                        aria-label={filtersVisible ? t(locale, 'hideTodoFilters') : t(locale, 'showTodoFilters')}
                        aria-pressed={filtersVisible}
                        title={filtersVisible ? t(locale, 'hideTodoFilters') : t(locale, 'showTodoFilters')}
                    >
                        <Filter size={16} strokeWidth={2.2} aria-hidden />
                    </IconButton>
                </div>

                <FieldValidationMessage
                    className={styles.formError}
                    id={titleValidation.messageId}
                    message={titleValidation.showError ? titleValidation.validation.error : null}
                />
            </form>

            {filtersVisible ? (
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
            ) : null}

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
