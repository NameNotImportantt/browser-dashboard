import * as repository from '@/data/todos/todoRepository';
import {
    appendSnapshotCollectionItem,
    mapSnapshotCollectionItem,
    patchSnapshotCollection,
    removeSnapshotCollectionItem
} from '../lib/snapshotMutations';
import {UndoActionKind, type DashboardStore, type SliceCreator, type TodosSlice} from '../types';

function getWorkspaceTodos(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.todos.filter(todo => todo.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

export const createTodosSlice: SliceCreator<TodosSlice> = (_set, get) => ({
    addTodo: async payload => {
        const todo = await repository.addTodo(payload, get().activeWorkspaceId, getWorkspaceTodos(get()).length);

        if (!todo) {
            return;
        }

        appendSnapshotCollectionItem(_set, 'todos', todo);
    },
    toggleTodo: async todoId => {
        const nextTodo = await repository.toggleTodo(todoId);

        if (!nextTodo) {
            return;
        }

        mapSnapshotCollectionItem(_set, 'todos', todoId, () => nextTodo);
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

        removeSnapshotCollectionItem(_set, 'todos', todoId);
    },
    reorderTodos: async orderedTodoIdList => {
        const updatedAt = await repository.reorderTodos(orderedTodoIdList);

        patchSnapshotCollection(_set, 'todos', todos => todos
            .map(todo => {
                const nextPosition = orderedTodoIdList.indexOf(todo.id);

                if (nextPosition < 0) {
                    return todo;
                }

                return {
                    ...todo,
                    position: nextPosition,
                    updatedAt,
                };
            })
            .sort((firstTodo, secondTodo) => firstTodo.position - secondTodo.position));
    },
});
