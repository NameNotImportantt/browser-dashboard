import {deleteWorkspaceScopedTableRows} from '@/data/lib/deleteWorkspaceScopedTableRows';
import {mergeSettings} from '@/data/settings';
import {db} from '@/db';
import {createId} from '@/lib';
import {patchSettings} from '../settings/settingsRepository';
import type {AppSettings, Bookmark, BookmarkCategory, Habit, Note, TodoItem, Workspace} from '@/db';

export async function selectWorkspace(workspaceId: string) {
    return patchSettings({lastWorkspaceId: workspaceId});
}

export async function addWorkspace(name: string, workspaces: Workspace[]) {
    const value = name.trim();

    if (!value) {return null;}

    const id = createId();
    const now = Date.now();
    const position = workspaces.length;

    const workspace: Workspace = {
        id,
        name: value,
        position,
        createdAt: now,
    };

    await db.workspaces.add(workspace);

    const settings = await patchSettings({lastWorkspaceId: id});

    return {workspace, settings};
}

export async function renameWorkspace(workspaceId: string, name: string) {
    const value = name.trim();

    if (!value) {return null;}

    const workspace = await db.workspaces.get(workspaceId);

    if (!workspace) {return null;}

    await db.workspaces.update(workspaceId, {name: value});

    return {
        ...workspace,
        name: value,
    };
}

export async function deleteWorkspace(workspaceId: string, workspaces: Workspace[]) {
    if (workspaces.length <= 1) {return null;}

    if (!workspaces.some(item => item.id === workspaceId)) {return null;}

    const remaining = workspaces.filter(item => item.id !== workspaceId);
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const isDeletingActive = currentSettings.lastWorkspaceId === workspaceId;

    const nextSettings: AppSettings = isDeletingActive
        ? {
            ...currentSettings,
            lastWorkspaceId: remaining[0]?.id ?? null,
            updatedAt: Date.now(),
        }
        : currentSettings;

    await db.transaction(
        'rw',
        [db.workspaces, db.todos, db.habits, db.bookmarks, db.bookmarkCategories, db.notes, db.settings],
        async () => {
            await Promise.all([
                deleteWorkspaceScopedTableRows(db.todos, workspaceId),
                deleteWorkspaceScopedTableRows(db.habits, workspaceId),
                deleteWorkspaceScopedTableRows(db.bookmarks, workspaceId),
                deleteWorkspaceScopedTableRows(db.bookmarkCategories, workspaceId),
                deleteWorkspaceScopedTableRows(db.notes, workspaceId),
                db.workspaces.delete(workspaceId),
            ]);

            if (isDeletingActive) {
                await db.settings.put(nextSettings);
            }
        },
    );

    return {
        nextSettings,
    };
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
