import {createId, mergeSettings} from '@/app';
import {db} from '@/db';
import {patchSettings} from './settingsRepository';
import type {Workspace} from '@/db';

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
