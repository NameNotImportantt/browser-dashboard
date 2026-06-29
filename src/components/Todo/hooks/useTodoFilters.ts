import {useMemo, useState} from 'react';
import {t, todayKey} from '@/app';
import {TODO_DATE_FILTERS, TodoDateFilter} from '../const/todoDateFilters';
import {TODO_PRIORITY_FILTERS, TodoPriorityFilter} from '../const/todoPriorityFilters';
import {TODO_STATUS_FILTERS, TodoStatusFilter} from '../const/todoStatusFilters';
import type {SelectOption} from '@/components/Select';
import type {AppLocale, TodoItem} from '@/db';

export function useTodoFilters(todos: TodoItem[], locale: AppLocale) {
    const [dateFilter, setDateFilter] = useState<TodoDateFilter>(TodoDateFilter.All);
    const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>(TodoStatusFilter.All);
    const [priorityFilter, setPriorityFilter] = useState<TodoPriorityFilter>(TodoPriorityFilter.All);
    const today = todayKey();

    const dateFilterOptions = useMemo<SelectOption[]>(
        () =>
            TODO_DATE_FILTERS.map(filter => ({
                value: filter,
                label: getTodoDateFilterLabel(filter, locale),
            })),
        [locale],
    );

    const statusFilterOptions = useMemo<SelectOption[]>(
        () =>
            TODO_STATUS_FILTERS.map(filter => ({
                value: filter,
                label: getTodoStatusFilterLabel(filter, locale),
            })),
        [locale],
    );

    const priorityFilterOptions = useMemo<SelectOption[]>(
        () =>
            TODO_PRIORITY_FILTERS.map(filter => ({
                value: filter,
                label: getTodoPriorityFilterLabel(filter, locale),
            })),
        [locale],
    );

    const filteredTodos = useMemo(
        () =>
            todos.filter(
                todo =>
                    matchesTodoDateFilter(todo, dateFilter, today)
                    && matchesTodoStatusFilter(todo, statusFilter)
                    && matchesTodoPriorityFilter(todo, priorityFilter),
            ),
        [dateFilter, priorityFilter, statusFilter, today, todos],
    );

    return {
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
    };
}

function matchesTodoDateFilter(todo: TodoItem, filter: TodoDateFilter, today: string) {
    if (filter === TodoDateFilter.All) {
        return true;
    }

    if (!todo.dueDate) {
        return false;
    }

    if (filter === TodoDateFilter.Today) {
        return todo.dueDate === today;
    }

    if (filter === TodoDateFilter.Upcoming) {
        return todo.dueDate > today;
    }

    return todo.dueDate < today;
}

function matchesTodoStatusFilter(todo: TodoItem, filter: TodoStatusFilter) {
    if (filter === TodoStatusFilter.All) {
        return true;
    }

    if (filter === TodoStatusFilter.Active) {
        return !todo.completed;
    }

    return todo.completed;
}

function matchesTodoPriorityFilter(todo: TodoItem, filter: TodoPriorityFilter) {
    if (filter === TodoPriorityFilter.All) {
        return true;
    }

    return todo.priority === filter;
}

function getTodoDateFilterLabel(filter: TodoDateFilter, locale: AppLocale) {
    if (filter === TodoDateFilter.Today) {return t(locale, 'todoFilterToday');}

    if (filter === TodoDateFilter.Upcoming) {return t(locale, 'todoFilterUpcoming');}

    if (filter === TodoDateFilter.Overdue) {return t(locale, 'todoFilterOverdue');}

    return t(locale, 'todoFilterAll');
}

function getTodoStatusFilterLabel(filter: TodoStatusFilter, locale: AppLocale) {
    if (filter === TodoStatusFilter.Active) {return t(locale, 'todoFilterActive');}

    if (filter === TodoStatusFilter.Completed) {return t(locale, 'todoFilterCompleted');}

    return t(locale, 'todoFilterAll');
}

function getTodoPriorityFilterLabel(filter: TodoPriorityFilter, locale: AppLocale) {
    if (filter === TodoPriorityFilter.High) {return t(locale, 'priorityHigh');}

    if (filter === TodoPriorityFilter.Medium) {return t(locale, 'priorityMedium');}

    if (filter === TodoPriorityFilter.Low) {return t(locale, 'priorityLow');}

    return t(locale, 'todoFilterAll');
}
