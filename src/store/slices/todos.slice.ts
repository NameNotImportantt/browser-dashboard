import * as repository from '@/data/todoRepository';
import type {DashboardStore, SliceCreator, TodosSlice} from '../types';

function getWorkspaceTodos(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.todos.filter(todo => todo.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

export const createTodosSlice: SliceCreator<TodosSlice> = (_set, get) => ({
    addTodo: async payload => {
        await repository.addTodo(payload, get().activeWorkspaceId, getWorkspaceTodos(get()).length);
        await get().refresh();
    },
    toggleTodo: async todoId => {
        await repository.toggleTodo(todoId);
        await get().refresh();
    },
    deleteTodo: async todoId => {
        await repository.deleteTodo(todoId);
        await get().refresh();
    },
    reorderTodos: async orderedTodoIdList => {
        await repository.reorderTodos(orderedTodoIdList);
        await get().refresh();
    },
});
