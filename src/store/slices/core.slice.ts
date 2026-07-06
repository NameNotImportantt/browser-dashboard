import {trackBootstrapDuration} from '@/app/bootstrap/devPerformance';
import {ensureSeedData, importDashboardBackup, loadSnapshot, parseDashboardBackupJson} from '@/data';
import type {CoreSlice, SliceCreator} from '../types';

export const createCoreSlice: SliceCreator<CoreSlice> = (set, get) => ({
    loading: true,
    error: null,
    snapshot: null,
    activeWorkspaceId: null,

    init: async () => {
        const startedAt = performance.now();

        try {
            set({loading: true, error: null});
            await ensureSeedData();
            await get().refresh();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Не удалось инициализировать данные',
            });
        } finally {
            trackBootstrapDuration(performance.now() - startedAt);
            set({loading: false});
        }
    },

    refresh: async () => {
        const nextSnapshot = await loadSnapshot();
        const preferredId = nextSnapshot.settings.lastWorkspaceId;
        const currentActiveWorkspaceId = get().activeWorkspaceId;

        const hasPreferred = preferredId && nextSnapshot.workspaces.some(item => item.id === preferredId);

        const hasActiveWorkspace =
      currentActiveWorkspaceId && nextSnapshot.workspaces.some(item => item.id === currentActiveWorkspaceId);

        set({
            activeWorkspaceId: hasPreferred
                ? preferredId
                : hasActiveWorkspace
                    ? currentActiveWorkspaceId
                    : nextSnapshot.workspaces[0]?.id ?? null,
            snapshot: nextSnapshot,
        });
    },

    importDashboardBackupJson: async json => {
        await importDashboardBackup(parseDashboardBackupJson(json));
        await get().refresh();
    },
});
