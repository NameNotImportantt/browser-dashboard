import {trackBootstrapDuration} from '@/app/bootstrap/devPerformance';
import {
    createSnapshotFromHomeBootstrapSnapshot,
    ensureSeedData,
    importDashboardBackup,
    loadHomeBootstrapSnapshot,
    loadSnapshot,
    parseDashboardBackupJson,
    saveHomeBootstrapSnapshot,
    SnapshotLoadMode,
    type Snapshot,
} from '@/data';
import {BootPhase, type CoreSlice, type SliceCreator} from '../types';

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
    bootPhase: BootPhase.Cold,
    hasRenderableSnapshot: false,
    deferredLoading: false,
    deferredReady: false,
    error: null,
    snapshot: null,
    activeWorkspaceId: null,

    init: async () => {
        const startedAt = performance.now();
        let didLoadFreshCriticalSnapshot = false;

        try {
            set({
                bootPhase: BootPhase.Cold,
                deferredLoading: false,
                deferredReady: false,
                error: null,
            });
            await ensureSeedData();

            const bootstrapCacheRecord = await loadHomeBootstrapSnapshot();

            if (bootstrapCacheRecord) {
                const cachedSnapshot = createSnapshotFromHomeBootstrapSnapshot(bootstrapCacheRecord.snapshot);

                set({
                    activeWorkspaceId: resolveActiveWorkspaceId(cachedSnapshot, bootstrapCacheRecord.activeWorkspaceId),
                    bootPhase: BootPhase.Cached,
                    hasRenderableSnapshot: true,
                    snapshot: cachedSnapshot,
                });
            }

            if (get().hasRenderableSnapshot) {
                set({bootPhase: BootPhase.Refreshing});
            }

            const nextSnapshot = await loadSnapshot(SnapshotLoadMode.Critical);
            const nextActiveWorkspaceId = resolveActiveWorkspaceId(nextSnapshot, get().activeWorkspaceId);

            set({
                activeWorkspaceId: nextActiveWorkspaceId,
                bootPhase: BootPhase.Ready,
                deferredLoading: true,
                deferredReady: false,
                hasRenderableSnapshot: true,
                snapshot: nextSnapshot,
            });

            await saveHomeBootstrapSnapshot(nextSnapshot, nextActiveWorkspaceId);
            didLoadFreshCriticalSnapshot = true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Не удалось инициализировать данные',
                bootPhase: get().hasRenderableSnapshot ? BootPhase.Cached : BootPhase.Error,
            });
        }

        trackBootstrapDuration(performance.now() - startedAt);

        if (didLoadFreshCriticalSnapshot) {
            void get().hydrateDeferredData();
        }
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
        const nextActiveWorkspaceId = resolveActiveWorkspaceId(nextSnapshot, get().activeWorkspaceId);

        set({
            activeWorkspaceId: nextActiveWorkspaceId,
            bootPhase: BootPhase.Ready,
            deferredLoading: false,
            deferredReady: true,
            error: null,
            hasRenderableSnapshot: true,
            snapshot: nextSnapshot,
        });

        await saveHomeBootstrapSnapshot(nextSnapshot, nextActiveWorkspaceId);
    },

    importDashboardBackupJson: async json => {
        await importDashboardBackup(parseDashboardBackupJson(json));
        await get().refresh();
    },
});
