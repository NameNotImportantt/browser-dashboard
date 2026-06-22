import * as repository from '@/data/workspaceRepository';
import type {DashboardStore, SliceCreator, WorkspacesSlice} from '../types';

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
        await repository.deleteWorkspace(workspaceId, getWorkspaces(get()));
        await get().refresh();
    },
});
