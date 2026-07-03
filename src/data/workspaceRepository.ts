import {createId, mergeSettings} from '@/app';
import {db} from '@/db';
import {patchSettings} from './settingsRepository';
import type {Bookmark, BookmarkCategory, Habit, Note, TodoItem, Workspace} from '@/db';

export async function selectWorkspace(workspaceId: string) {
    await patchSettings({lastWorkspaceId: workspaceId});
}

export async function addWorkspace(name: string, workspaces: Workspace[]) {
    const value = name.trim();

    if (!value) {return;}

    const id = createId();
    const now = Date.now();
    const position = workspaces.length;

    await db.workspaces.add({
        id,
        name: value,
        position,
        createdAt: now,
    });

    await patchSettings({lastWorkspaceId: id});
}

export async function renameWorkspace(workspaceId: string, name: string) {
    const value = name.trim();

    if (!value) {return;}

    const workspace = await db.workspaces.get(workspaceId);

    if (!workspace) {return;}

    await db.workspaces.update(workspaceId, {name: value});
}

export async function deleteWorkspace(workspaceId: string, workspaces: Workspace[]) {
    if (workspaces.length <= 1) {return;}

    if (!workspaces.some(item => item.id === workspaceId)) {return;}

    const remaining = workspaces.filter(item => item.id !== workspaceId);
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const isDeletingActive = currentSettings.lastWorkspaceId === workspaceId;

    await db.transaction(
        'rw',
        [db.workspaces, db.todos, db.habits, db.bookmarks, db.bookmarkCategories, db.notes, db.settings],
        async () => {
            await Promise.all([
                db.todos.where('workspaceId').equals(workspaceId).delete(),
                db.habits.where('workspaceId').equals(workspaceId).delete(),
                db.bookmarks.where('workspaceId').equals(workspaceId).delete(),
                db.bookmarkCategories.where('workspaceId').equals(workspaceId).delete(),
                db.notes.where('workspaceId').equals(workspaceId).delete(),
                db.workspaces.delete(workspaceId),
            ]);

            if (isDeletingActive) {
                await db.settings.put({
                    ...currentSettings,
                    lastWorkspaceId: remaining[0]?.id ?? null,
                    updatedAt: Date.now(),
                });
            }
        },
    );
}

export async function restoreWorkspaceSubtree(payload: {
    workspace: Workspace;
    todos: TodoItem[];
    habits: Habit[];
    bookmarks: Bookmark[];
    bookmarkCategories: BookmarkCategory[];
    notes: Note[];
    wasActive: boolean;
}) {
    const currentSettings = mergeSettings(await db.settings.get('app'));

    await db.transaction(
        'rw',
        [db.workspaces, db.todos, db.habits, db.bookmarks, db.bookmarkCategories, db.notes, db.settings],
        async () => {
            await db.workspaces.put(payload.workspace);

            if (payload.todos.length > 0) {
                await db.todos.bulkPut(payload.todos);
            }

            if (payload.habits.length > 0) {
                await db.habits.bulkPut(payload.habits);
            }

            if (payload.bookmarks.length > 0) {
                await db.bookmarks.bulkPut(payload.bookmarks);
            }

            if (payload.bookmarkCategories.length > 0) {
                await db.bookmarkCategories.bulkPut(payload.bookmarkCategories);
            }

            if (payload.notes.length > 0) {
                await db.notes.bulkPut(payload.notes);
            }

            if (payload.wasActive) {
                await db.settings.put({
                    ...currentSettings,
                    lastWorkspaceId: payload.workspace.id,
                    updatedAt: Date.now(),
                });
            }
        },
    );
}
