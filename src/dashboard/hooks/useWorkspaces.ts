import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useWorkspaces() {
    const workspacesCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.workspaces ?? []);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);
    const workspaces = useMemo(() => workspacesCollection, [workspacesCollection]);

    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            selectWorkspace: dashboardStore.selectWorkspace,
            addWorkspace: dashboardStore.addWorkspace,
            renameWorkspace: dashboardStore.renameWorkspace,
            deleteWorkspace: dashboardStore.deleteWorkspace,
        })),
    );

    return {
        workspaces,
        activeWorkspaceId,
        ...actions,
    };
}
