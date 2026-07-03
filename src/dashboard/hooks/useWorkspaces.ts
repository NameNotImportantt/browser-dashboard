import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useWorkspaces() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);
    const workspaces = useMemo(() => snapshot?.workspaces ?? [], [snapshot]);

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
