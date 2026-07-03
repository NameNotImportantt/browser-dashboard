import * as repository from '@/data/notes/noteRepository';
import type {DashboardStore, NotesSlice, SliceCreator} from '../types';
import type {NoteDraft} from '@/db';

function getWorkspaceNotes(dashboardStore: DashboardStore) {
    const activeWorkspaceId = dashboardStore.activeWorkspaceId;

    if (!activeWorkspaceId) {
        return [];
    }

    return (dashboardStore.snapshot?.notes.filter(note => note.workspaceId === activeWorkspaceId) ?? []).sort(
        (firstNote, secondNote) => firstNote.position - secondNote.position,
    );
}

export const createNotesSlice: SliceCreator<NotesSlice> = (set, get) => ({
    activeNoteId: null,

    selectNote: noteId => {
        set({activeNoteId: noteId});
    },

    createNote: async (draft: NoteDraft = {title: '', text: ''}) => {
        const dashboardStore = get();
        const noteId = await repository.createNote(draft, dashboardStore.activeWorkspaceId, getWorkspaceNotes(dashboardStore));

        if (noteId) {
            set({activeNoteId: noteId});
        }

        await get().refresh();

        return noteId;
    },

    updateNote: async (noteId, patch) => {
        await repository.updateNote(noteId, patch);
        await get().refresh();
    },

    deleteNote: async noteId => {
        const dashboardStore = get();
        const workspaceNotes = getWorkspaceNotes(dashboardStore);
        const noteIndex = workspaceNotes.findIndex(note => note.id === noteId);
        const activeNoteId = dashboardStore.activeNoteId;

        const nextActiveNoteId = activeNoteId === noteId
            ? workspaceNotes[noteIndex + 1]?.id ?? workspaceNotes[noteIndex - 1]?.id ?? null
            : activeNoteId;

        await repository.deleteNote(noteId);
        set({activeNoteId: nextActiveNoteId});
        await get().refresh();
    },
});
