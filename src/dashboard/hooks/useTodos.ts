import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';
import {selectWorkspaceScopedItems} from './lib/workspaceCollections';

export function useTodos() {
    const todosCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.todos ?? []);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const todos = useMemo(() => {
        const filtered = selectWorkspaceScopedItems(todosCollection, activeWorkspaceId);

        return [...filtered].sort((firstTodo, secondTodo) => {
            if (firstTodo.completed !== secondTodo.completed) {
                return Number(firstTodo.completed) - Number(secondTodo.completed);
            }

            return firstTodo.position - secondTodo.position;
        });
    }, [activeWorkspaceId, todosCollection]);
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
