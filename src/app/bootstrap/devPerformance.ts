type DevPerformanceFieldValue = boolean | null | number | string | undefined;

type DevPerformanceFields = Record<string, DevPerformanceFieldValue>;

interface DevPerformanceSnapshot {
    bootstrapCount: number;
    fullSnapshotReloadCount: number;
    noteAutosavePersistCount: number;
    noteAutosaveScheduleCount: number;
    lastBootstrapDurationMs: number | null;
    lastFullSnapshotDurationMs: number | null;
    lastActionDurationMs: Record<string, number>;
}

declare global {
    interface Window {
        __BROWSER_DASHBOARD_PERF__?: DevPerformanceSnapshot;
    }
}

const DEV_PERFORMANCE_KEY = '__BROWSER_DASHBOARD_PERF__';

const initialDevPerformanceSnapshot: DevPerformanceSnapshot = {
    bootstrapCount: 0,
    fullSnapshotReloadCount: 0,
    noteAutosavePersistCount: 0,
    noteAutosaveScheduleCount: 0,
    lastBootstrapDurationMs: null,
    lastFullSnapshotDurationMs: null,
    lastActionDurationMs: {},
};

function isDevPerformanceEnabled() {
    return import.meta.env.DEV;
}

function roundDuration(durationMs: number) {
    return Math.round(durationMs * 100) / 100;
}

function getDevPerformanceSnapshot() {
    if (!isDevPerformanceEnabled()) {
        return null;
    }

    if (typeof window === 'undefined') {
        return initialDevPerformanceSnapshot;
    }

    const currentSnapshot = window[DEV_PERFORMANCE_KEY];

    if (currentSnapshot) {
        return currentSnapshot;
    }

    window[DEV_PERFORMANCE_KEY] = {
        ...initialDevPerformanceSnapshot,
        lastActionDurationMs: {},
    };

    return window[DEV_PERFORMANCE_KEY]!;
}

function logDevPerformance(scope: string, message: string, fields?: DevPerformanceFields) {
    if (!isDevPerformanceEnabled()) {
        return;
    }

    console.info(`[perf:${scope}] ${message}`, fields ?? {});
}

export function trackStoreActionStart(actionName: string) {
    if (!isDevPerformanceEnabled()) {
        return 0;
    }

    return performance.now();
}

export function trackStoreActionSuccess(actionName: string, startedAt: number) {
    if (!isDevPerformanceEnabled()) {
        return;
    }

    const durationMs = roundDuration(performance.now() - startedAt);
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (devPerformanceSnapshot) {
        devPerformanceSnapshot.lastActionDurationMs[actionName] = durationMs;
    }

    logDevPerformance('store', `${actionName} completed`, {actionName, durationMs});
}

export function trackStoreActionFailure(actionName: string, startedAt: number) {
    if (!isDevPerformanceEnabled()) {
        return;
    }

    const durationMs = roundDuration(performance.now() - startedAt);
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (devPerformanceSnapshot) {
        devPerformanceSnapshot.lastActionDurationMs[actionName] = durationMs;
    }

    logDevPerformance('store', `${actionName} failed`, {actionName, durationMs});
}

export function trackBootstrapDuration(durationMs: number) {
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (!devPerformanceSnapshot) {
        return;
    }

    const roundedDurationMs = roundDuration(durationMs);

    devPerformanceSnapshot.bootstrapCount += 1;
    devPerformanceSnapshot.lastBootstrapDurationMs = roundedDurationMs;

    logDevPerformance('bootstrap', 'init completed', {
        bootstrapCount: devPerformanceSnapshot.bootstrapCount,
        durationMs: roundedDurationMs,
    });
}

export function trackFullSnapshotReload(durationMs: number, fields?: DevPerformanceFields) {
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (!devPerformanceSnapshot) {
        return;
    }

    const roundedDurationMs = roundDuration(durationMs);

    devPerformanceSnapshot.fullSnapshotReloadCount += 1;
    devPerformanceSnapshot.lastFullSnapshotDurationMs = roundedDurationMs;

    logDevPerformance('snapshot', 'full snapshot reload completed', {
        fullSnapshotReloadCount: devPerformanceSnapshot.fullSnapshotReloadCount,
        durationMs: roundedDurationMs,
        ...fields,
    });
}

export function trackNoteAutosaveScheduled(fields?: DevPerformanceFields) {
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (!devPerformanceSnapshot) {
        return;
    }

    devPerformanceSnapshot.noteAutosaveScheduleCount += 1;

    logDevPerformance('notes', 'autosave scheduled', {
        noteAutosaveScheduleCount: devPerformanceSnapshot.noteAutosaveScheduleCount,
        ...fields,
    });
}

export function trackNoteAutosavePersist(durationMs: number, fields?: DevPerformanceFields) {
    const devPerformanceSnapshot = getDevPerformanceSnapshot();

    if (!devPerformanceSnapshot) {
        return;
    }

    const roundedDurationMs = roundDuration(durationMs);

    devPerformanceSnapshot.noteAutosavePersistCount += 1;

    logDevPerformance('notes', 'autosave persisted', {
        noteAutosavePersistCount: devPerformanceSnapshot.noteAutosavePersistCount,
        durationMs: roundedDurationMs,
        ...fields,
    });
}
