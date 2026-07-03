import * as repository from '@/data/todos/todoRepository';
import {UndoActionKind, type DashboardStore, type SliceCreator, type TodosSlice} from '../types';

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
        const todo = getWorkspaceTodos(get()).find(workspaceTodo => workspaceTodo.id === todoId);

        await repository.deleteTodo(todoId);

        if (todo) {
            get().enqueueUndoEntry({
                kind: UndoActionKind.TodoDelete,
                todo,
            });
        }

        await get().refresh();
    },
    reorderTodos: async orderedTodoIdList => {
        await repository.reorderTodos(orderedTodoIdList);
        await get().refresh();
    },
});
