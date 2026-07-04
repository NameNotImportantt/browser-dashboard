import {useMemo, useState, type FormEvent} from 'react';
import {useFieldValidation} from '@/components';
import {useSettings, useTodos} from '@/dashboard';
import {t} from '@/i18n';
import {reorderIds} from '../lib/reorderIds';
import type {TodoPriority} from '@/db';

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

export function useTodoWidgetController(filteredTodoIds: string[]) {
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

    const isEmptyTodoList = todos.length === 0;
    const emptyMessage = isEmptyTodoList ? t(locale, 'todoEmpty') : t(locale, 'todoFilteredEmpty');

    const handleTitleChange = (nextValue: string) => {
        setTitle(nextValue);
        titleValidation.clearError();
    };

    const handlePriorityChange = (value: string) => {
        setPriority(value as TodoPriority);
    };

    const handleDueDateChange = (nextValue: string) => {
        setDueDate(nextValue);
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

    const dropOn = async (targetId: string) => {
        if (!draggedId || draggedId === targetId) {
            return;
        }

        const reorderedVisibleTodoIds = reorderIds(filteredTodoIds, draggedId, targetId);
        const orderedTodoIds = mergeFilteredTodoOrder(
            todos.map(todo => todo.id),
            filteredTodoIds,
            reorderedVisibleTodoIds,
        );

        setDraggedId(null);
        await reorderTodos(orderedTodoIds);
    };

    const handleToggleTodo = (todoId: string) => {
        void toggleTodo(todoId);
    };

    const handleDeleteTodo = (todoId: string) => {
        void deleteTodo(todoId);
    };

    const handleDropTodo = (todoId: string) => {
        void dropOn(todoId);
    };

    return {
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
    };
}
