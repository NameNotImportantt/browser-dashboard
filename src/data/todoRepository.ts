import {createId} from '@/app';
import {db} from '@/db';
import type {CreateTodoPayload} from '@/db';

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

export async function reorderTodos(orderedIds: string[]) {
    const updates = orderedIds.map((id, index) => ({
        key: id,
        changes: {
            position: index,
            updatedAt: Date.now(),
        },
    }));

    await Promise.all(updates.map(item => db.todos.update(item.key, item.changes)));
}
