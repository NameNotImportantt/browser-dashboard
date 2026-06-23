import * as repository from '@/data/workspaceRepository';
import {UndoActionKind, type DashboardStore, type SliceCreator, type WorkspacesSlice} from '../types';

function getWorkspaces(dashboardStore: DashboardStore) {
    return dashboardStore.snapshot?.workspaces ?? [];
}

export const createWorkspacesSlice: SliceCreator<WorkspacesSlice> = (_set, get) => ({
    selectWorkspace: async workspaceId => {
        await repository.selectWorkspace(workspaceId);
        await get().refresh();
    },
    addWorkspace: async name => {
        await repository.addWorkspace(name, getWorkspaces(get()));
        await get().refresh();
    },
    deleteWorkspace: async workspaceId => {
        const dashboardStore = get();
        const snapshot = dashboardStore.snapshot;
        const workspaces = getWorkspaces(dashboardStore);
        const workspace = workspaces.find(currentWorkspace => currentWorkspace.id === workspaceId);

        await repository.deleteWorkspace(workspaceId, workspaces);

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

        await get().refresh();
    },
});
