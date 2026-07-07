import * as repository from '@/data/workspaces/workspaceRepository';
import {persistHomeBootstrapCache} from '../lib/persistHomeBootstrapCache';
import {
    appendSnapshotCollectionItem,
    mapSnapshotCollectionItem,
    patchSnapshot,
    removeSnapshotCollectionItem,
    replaceSnapshotField
} from '../lib/snapshotMutations';
import {UndoActionKind, type DashboardStore, type SliceCreator, type WorkspacesSlice} from '../types';

function getWorkspaces(dashboardStore: DashboardStore) {
    return dashboardStore.snapshot?.workspaces ?? [];
}

export const createWorkspacesSlice: SliceCreator<WorkspacesSlice> = (_set, get) => ({
    selectWorkspace: async workspaceId => {
        const settings = await repository.selectWorkspace(workspaceId);

        replaceSnapshotField(_set, 'settings', settings);
        _set({activeWorkspaceId: workspaceId});
        await persistHomeBootstrapCache(get);
    },
    addWorkspace: async name => {
        const result = await repository.addWorkspace(name, getWorkspaces(get()));

        if (!result) {
            return;
        }

        appendSnapshotCollectionItem(_set, 'workspaces', result.workspace);
        replaceSnapshotField(_set, 'settings', result.settings);
        _set({activeWorkspaceId: result.workspace.id});
        await persistHomeBootstrapCache(get);
    },
    renameWorkspace: async (workspaceId, name) => {
        const workspace = await repository.renameWorkspace(workspaceId, name);

        if (!workspace) {
            return;
        }

        mapSnapshotCollectionItem(_set, 'workspaces', workspaceId, () => workspace);
        await persistHomeBootstrapCache(get);
    },
    deleteWorkspace: async workspaceId => {
        const dashboardStore = get();
        const snapshot = dashboardStore.snapshot;
        const workspaces = getWorkspaces(dashboardStore);
        const workspace = workspaces.find(currentWorkspace => currentWorkspace.id === workspaceId);

        const result = await repository.deleteWorkspace(workspaceId, workspaces);

        if (!result) {
            return;
        }

        if (snapshot && workspace && workspaces.length > 1) {
            get().enqueueUndoEntry({
                kind: UndoActionKind.WorkspaceDelete,
                workspace,
                todos: snapshot.todos.filter(todo => todo.workspaceId === workspaceId),
                habits: snapshot.habits.filter(habit => habit.workspaceId === workspaceId),
                bookmarks: snapshot.bookmarks.filter(bookmark => bookmark.workspaceId === workspaceId),
                bookmarkCategories: snapshot.bookmarkCategories.filter(category => category.workspaceId === workspaceId),
                notes: snapshot.notes.filter(note => note.workspaceId === workspaceId),
                wasActive: dashboardStore.activeWorkspaceId === workspaceId,
            });
        }

        replaceSnapshotField(_set, 'settings', result.nextSettings);
        removeSnapshotCollectionItem(_set, 'workspaces', workspaceId);
        patchSnapshot(_set, currentSnapshot => ({
            ...currentSnapshot,
            todos: currentSnapshot.todos.filter(todo => todo.workspaceId !== workspaceId),
            habits: currentSnapshot.habits.filter(habit => habit.workspaceId !== workspaceId),
            bookmarks: currentSnapshot.bookmarks.filter(bookmark => bookmark.workspaceId !== workspaceId),
            bookmarkCategories: currentSnapshot.bookmarkCategories.filter(category => category.workspaceId !== workspaceId),
            notes: currentSnapshot.notes.filter(note => note.workspaceId !== workspaceId),
        }));
        _set({
            activeNoteId: dashboardStore.activeWorkspaceId === workspaceId ? null : dashboardStore.activeNoteId,
            activeWorkspaceId: result.nextSettings.lastWorkspaceId,
        });
        await persistHomeBootstrapCache(get);
    },
});
