import {db} from '@/db';
import {createId} from '@/lib';
import type {CreateTodoPayload, TodoItem} from '@/db';

export async function addTodo(payload: CreateTodoPayload, activeWorkspaceId: string | null, position: number) {
    if (!activeWorkspaceId) {return null;}

    const title = payload.title.trim();

    if (!title) {return null;}

    const now = Date.now();

    const todo: TodoItem = {
        id: createId(),
        workspaceId: activeWorkspaceId,
        title,
        completed: false,
        priority: payload.priority,
        dueDate: payload.dueDate,
        position,
        createdAt: now,
        updatedAt: now,
    };

    await db.todos.add(todo);

    return todo;
}

export async function toggleTodo(todoId: string) {
    const item = await db.todos.get(todoId);

    if (!item) {return null;}

    const nextTodo: TodoItem = {
        ...item,
        completed: !item.completed,
        updatedAt: Date.now(),
    };

    await db.todos.update(todoId, {
        completed: nextTodo.completed,
        updatedAt: nextTodo.updatedAt,
    });

    return nextTodo;
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

    return updatedAt;
}
