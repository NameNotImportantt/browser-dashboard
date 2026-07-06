import {trackBootstrapDuration} from '@/app/bootstrap/devPerformance';
import {
    ensureSeedData,
    importDashboardBackup,
    loadSnapshot,
    parseDashboardBackupJson,
    SnapshotLoadMode,
    type Snapshot,
} from '@/data';
import type {CoreSlice, SliceCreator} from '../types';

function resolveActiveWorkspaceId(snapshot: Snapshot, currentActiveWorkspaceId: string | null) {
    const preferredId = snapshot.settings.lastWorkspaceId;
    const hasPreferred = preferredId && snapshot.workspaces.some(item => item.id === preferredId);

    const hasActiveWorkspace =
        currentActiveWorkspaceId && snapshot.workspaces.some(item => item.id === currentActiveWorkspaceId);

    return hasPreferred
        ? preferredId
        : hasActiveWorkspace
            ? currentActiveWorkspaceId
            : snapshot.workspaces[0]?.id ?? null;
}

export const createCoreSlice: SliceCreator<CoreSlice> = (set, get) => ({
    loading: true,
    deferredLoading: false,
    deferredReady: false,
    error: null,
    snapshot: null,
    activeWorkspaceId: null,

    init: async () => {
        const startedAt = performance.now();

        try {
            set({loading: true, error: null});
            await ensureSeedData();
            const nextSnapshot = await loadSnapshot(SnapshotLoadMode.Critical);

            set({
                activeWorkspaceId: resolveActiveWorkspaceId(nextSnapshot, get().activeWorkspaceId),
                deferredLoading: true,
                deferredReady: false,
                snapshot: nextSnapshot,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Не удалось инициализировать данные',
            });
        } finally {
            trackBootstrapDuration(performance.now() - startedAt);
            set({loading: false});
        }

        void get().hydrateDeferredData();
    },

    hydrateDeferredData: async () => {
        if (!get().snapshot || get().deferredReady) {
            return;
        }

        set({deferredLoading: true});

        try {
            const nextSnapshot = await loadSnapshot(SnapshotLoadMode.Full);

            set({
                activeWorkspaceId: resolveActiveWorkspaceId(nextSnapshot, get().activeWorkspaceId),
                deferredLoading: false,
                deferredReady: true,
                snapshot: nextSnapshot,
            });
        } catch {
            set({deferredLoading: false});
        }
    },

    refresh: async () => {
        const nextSnapshot = await loadSnapshot();

        set({
            activeWorkspaceId: resolveActiveWorkspaceId(nextSnapshot, get().activeWorkspaceId),
            deferredLoading: false,
            deferredReady: true,
            snapshot: nextSnapshot,
        });
    },

    importDashboardBackupJson: async json => {
        await importDashboardBackup(parseDashboardBackupJson(json));
        await get().refresh();
    },
});
