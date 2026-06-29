import {useEffect, useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';
import {useNoteDraft} from './useNoteDraft';

export function useNotes() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const {
        activeNoteId,
        storeCreateNote,
        storeDeleteNote,
        storeSelectNote,
        storeUpdateNote,
    } = useDashboardStore(
        useShallow(dashboardStore => ({
            activeNoteId: dashboardStore.activeNoteId,
            storeCreateNote: dashboardStore.createNote,
            storeDeleteNote: dashboardStore.deleteNote,
            storeSelectNote: dashboardStore.selectNote,
            storeUpdateNote: dashboardStore.updateNote,
        })),
    );

    const notes = useMemo(() => {
        if (!activeWorkspaceId) {return [];}

        return (snapshot?.notes.filter(note => note.workspaceId === activeWorkspaceId) ?? []).sort(
            (firstNote, secondNote) => firstNote.position - secondNote.position,
        );
    }, [activeWorkspaceId, snapshot]);

    const activeNote = useMemo(() => {
        if (notes.length === 0) {return null;}

        return notes.find(note => note.id === activeNoteId) ?? notes[0] ?? null;
    }, [activeNoteId, notes]);
    const {
        draftTitle,
        draftText,
        saveStatus,
        setDraftTitle,
        setDraftText,
        flushNoteDraft,
    } = useNoteDraft({
        activeNote,
        activeWorkspaceId,
        createNote: storeCreateNote,
        updateNote: async (noteId, draft) => {
            await storeUpdateNote(noteId, {
                title: draft.title,
                text: draft.text,
            });
        },
    });

    const createNote = async () => {
        await flushNoteDraft();
        await storeCreateNote();
    };

    const selectNote = async (noteId: string | null) => {
        await flushNoteDraft();
        storeSelectNote(noteId);
    };

    const deleteNote = async (noteId: string) => {
        await flushNoteDraft();
        await storeDeleteNote(noteId);
    };

    useEffect(() => {
        const resolvedActiveNoteId = activeNote?.id ?? null;

        if (activeNoteId !== resolvedActiveNoteId) {
            storeSelectNote(resolvedActiveNoteId);
        }
    }, [activeNote?.id, activeNoteId, storeSelectNote]);

    return {
        notes,
        activeNote,
        draftTitle,
        draftText,
        saveStatus,
        createNote,
        selectNote,
        deleteNote,
        setDraftTitle,
        setDraftText,
        flushNoteDraft,
    };
}
