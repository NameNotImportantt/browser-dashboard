import {db} from '@/db';
import {createId} from '@/lib';
import type {CreateTodoPayload, TodoItem} from '@/db';

export async function addTodo(payload: CreateTodoPayload, activeWorkspaceId: string | null, position: number) {
    if (!activeWorkspaceId) {return;}

    const title = payload.title.trim();

    if (!title) {return;}

    const now = Date.now();

    await db.todos.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        title,
        completed: false,
        priority: payload.priority,
        dueDate: payload.dueDate,
        position,
        createdAt: now,
        updatedAt: now,
    });
}

export async function toggleTodo(todoId: string) {
    const item = await db.todos.get(todoId);

    if (!item) {return;}

    await db.todos.update(todoId, {
        completed: !item.completed,
        updatedAt: Date.now(),
    });
}

export async function deleteTodo(todoId: string) {
    await db.todos.delete(todoId);
}

export async function restoreTodo(todo: TodoItem) {
    await db.todos.put(todo);
}

export async function reorderTodos(orderedIds: string[]) {
    const updatedAt = Date.now();

    await db.transaction('rw', db.todos, async () => {
        for (const [position, todoId] of orderedIds.entries()) {
            await db.todos.update(todoId, {position, updatedAt});
        }
    });
}
