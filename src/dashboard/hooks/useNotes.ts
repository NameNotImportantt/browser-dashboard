import {useMemo} from 'react';
import {useDashboardStore} from '@/store';

export function useNotes() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const noteText = useMemo(() => {
        if (!activeWorkspaceId) {return '';}

        const workspaceNotes = snapshot?.notes.filter(note => note.workspaceId === activeWorkspaceId) ?? [];

        if (workspaceNotes.length === 0) {return '';}

        return [...workspaceNotes].sort((firstNote, secondNote) => secondNote.updatedAt - firstNote.updatedAt)[0]?.text ?? '';
    }, [activeWorkspaceId, snapshot]);

    const saveNote = useDashboardStore(dashboardStore => dashboardStore.saveNote);

    return {noteText, saveNote};
}
