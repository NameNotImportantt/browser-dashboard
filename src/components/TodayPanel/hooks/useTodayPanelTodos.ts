import {useMemo} from 'react';
import {useTodos} from '@/dashboard';
import {todayKey} from '@/lib';
import type {TodoItem} from '@/db';

export function useTodayPanelTodos(showCompleted: boolean) {
    const {todos, toggleTodo} = useTodos();
    const today = todayKey();

    const panelTodos = useMemo(
        () => buildTodayPanelTodos(todos, today, showCompleted),
        [showCompleted, today, todos],
    );

    return {
        panelTodos,
        toggleTodo,
    };
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
