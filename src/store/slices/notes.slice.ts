import * as repository from '@/data/notes/noteRepository';
import {appendSortedSnapshotCollectionItem, mapSnapshotCollectionItem, removeSnapshotCollectionItem} from '../lib/snapshotMutations';
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
        const note = await repository.createNote(draft, dashboardStore.activeWorkspaceId, getWorkspaceNotes(dashboardStore));

        if (!note) {
            return null;
        }

        set({activeNoteId: note.id});
        appendSortedSnapshotCollectionItem(set, 'notes', note);

        return note.id;
    },

    updateNote: async (noteId, patch) => {
        const nextNote = await repository.updateNote(noteId, patch);

        if (!nextNote) {
            return;
        }

        mapSnapshotCollectionItem(set, 'notes', noteId, () => nextNote);
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
        removeSnapshotCollectionItem(set, 'notes', noteId);
    },
});
