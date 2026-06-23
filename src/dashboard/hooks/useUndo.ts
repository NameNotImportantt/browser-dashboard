import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useUndo() {
    const currentUndoEntry = useDashboardStore(dashboardStore => dashboardStore.currentUndoEntry);

    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            enqueueUndoEntry: dashboardStore.enqueueUndoEntry,
            clearExpiredUndoEntry: dashboardStore.clearExpiredUndoEntry,
            clearCurrentUndoEntry: dashboardStore.clearCurrentUndoEntry,
            undoCurrentUndoEntry: dashboardStore.undoCurrentUndoEntry,
        })),
    );

    return {
        currentUndoEntry,
        ...actions,
    };
}
