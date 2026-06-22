import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useTodos() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const todos = useMemo(() => {
        if (!activeWorkspaceId) {return [];}

        const filtered = snapshot?.todos.filter(todo => todo.workspaceId === activeWorkspaceId) ?? [];

        return [...filtered].sort((firstTodo, secondTodo) => {
            if (firstTodo.completed !== secondTodo.completed) {
                return Number(firstTodo.completed) - Number(secondTodo.completed);
            }

            return firstTodo.position - secondTodo.position;
        });
    }, [activeWorkspaceId, snapshot]);
    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            addTodo: dashboardStore.addTodo,
            toggleTodo: dashboardStore.toggleTodo,
            deleteTodo: dashboardStore.deleteTodo,
            reorderTodos: dashboardStore.reorderTodos,
        })),
    );

    return {todos, ...actions};
}
