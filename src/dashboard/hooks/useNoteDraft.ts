import {useEffect, useRef, useState} from 'react';
import type {Note, NoteDraft} from '@/db';

type NoteSaveStatus = 'idle' | 'saving' | 'saved';

const NOTE_SAVE_DEBOUNCE_MS = 450;
const NOTE_SAVED_STATUS_VISIBILITY_MS = 1400;

interface PendingNoteSave {
    workspaceId: string | null;
    noteId: string | null;
    title: string;
    text: string;
}

interface UseNoteDraftParams {
    activeNote: Note | null;
    activeWorkspaceId: string | null;
    createNote: (draft: NoteDraft) => Promise<string | null>;
    updateNote: (noteId: string, draft: NoteDraft) => Promise<void>;
}

function isDraftBlank(draft: NoteDraft) {
    return draft.title.trim().length === 0 && draft.text.trim().length === 0;
}

function isSamePendingSave(firstPendingSave: PendingNoteSave | null, secondPendingSave: PendingNoteSave | null) {
    if (!firstPendingSave || !secondPendingSave) {
        return false;
    }

    return firstPendingSave.workspaceId === secondPendingSave.workspaceId
        && firstPendingSave.noteId === secondPendingSave.noteId
        && firstPendingSave.title === secondPendingSave.title
        && firstPendingSave.text === secondPendingSave.text;
}

export function useNoteDraft({
    activeNote,
    activeWorkspaceId,
    createNote,
    updateNote,
}: UseNoteDraftParams) {
    const [draftTitle, setDraftTitle] = useState(activeNote?.title ?? '');
    const [draftText, setDraftText] = useState(activeNote?.text ?? '');
    const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('idle');
    const pendingSaveTimeoutIdRef = useRef<number | null>(null);
    const pendingStatusResetTimeoutIdRef = useRef<number | null>(null);
    const pendingNoteSaveRef = useRef<PendingNoteSave | null>(null);
    const isPersistingRef = useRef(false);

    const clearPendingSaveTimeout = () => {
        if (pendingSaveTimeoutIdRef.current !== null) {
            window.clearTimeout(pendingSaveTimeoutIdRef.current);
            pendingSaveTimeoutIdRef.current = null;
        }
    };

    const clearPendingStatusResetTimeout = () => {
        if (pendingStatusResetTimeoutIdRef.current !== null) {
            window.clearTimeout(pendingStatusResetTimeoutIdRef.current);
            pendingStatusResetTimeoutIdRef.current = null;
        }
    };

    const scheduleSavedStatusReset = () => {
        clearPendingStatusResetTimeout();
        pendingStatusResetTimeoutIdRef.current = window.setTimeout(() => {
            setSaveStatus('idle');
            pendingStatusResetTimeoutIdRef.current = null;
        }, NOTE_SAVED_STATUS_VISIBILITY_MS);
    };

    const persistNoteDraft = async (pendingNoteSave: PendingNoteSave) => {
        if (isPersistingRef.current) {
            pendingNoteSaveRef.current = pendingNoteSave;
            return;
        }

        if (!pendingNoteSave.noteId && isDraftBlank({title: pendingNoteSave.title, text: pendingNoteSave.text})) {
            pendingNoteSaveRef.current = null;
            setSaveStatus('idle');
            return;
        }

        isPersistingRef.current = true;
        setSaveStatus('saving');

        try {
            if (pendingNoteSave.noteId) {
                await updateNote(pendingNoteSave.noteId, {
                    title: pendingNoteSave.title,
                    text: pendingNoteSave.text,
                });
            } else {
                await createNote({
                    title: pendingNoteSave.title,
                    text: pendingNoteSave.text,
                });
            }

            pendingNoteSaveRef.current = null;
            setSaveStatus('saved');
            scheduleSavedStatusReset();
        } finally {
            isPersistingRef.current = false;
        }

        if (pendingNoteSaveRef.current && !isSamePendingSave(pendingNoteSaveRef.current, pendingNoteSave)) {
            const nextPendingNoteSave = pendingNoteSaveRef.current;

            pendingNoteSaveRef.current = null;

            await persistNoteDraft(nextPendingNoteSave);
        }
    };

    const flushNoteDraft = async () => {
        clearPendingSaveTimeout();

        if (!pendingNoteSaveRef.current) {
            return;
        }

        const pendingNoteSave = pendingNoteSaveRef.current;

        pendingNoteSaveRef.current = null;

        await persistNoteDraft(pendingNoteSave);
    };

    const updateDraftTitle = (nextTitle: string) => {
        clearPendingStatusResetTimeout();
        setSaveStatus('idle');
        setDraftTitle(nextTitle);
    };

    const updateDraftText = (nextText: string) => {
        clearPendingStatusResetTimeout();
        setSaveStatus('idle');
        setDraftText(nextText);
    };

    useEffect(() => {
        clearPendingSaveTimeout();
        clearPendingStatusResetTimeout();
        pendingNoteSaveRef.current = null;
        setDraftTitle(activeNote?.title ?? '');
        setDraftText(activeNote?.text ?? '');
        setSaveStatus('idle');
    }, [activeNote?.id, activeWorkspaceId]);

    useEffect(() => {
        const persistedTitle = activeNote?.title ?? '';
        const persistedText = activeNote?.text ?? '';

        const hasPendingChanges = activeNote
            ? draftTitle !== persistedTitle || draftText !== persistedText
            : !isDraftBlank({title: draftTitle, text: draftText});

        if (!activeWorkspaceId || !hasPendingChanges) {
            pendingNoteSaveRef.current = null;
            clearPendingSaveTimeout();
            return;
        }

        pendingNoteSaveRef.current = {
            workspaceId: activeWorkspaceId,
            noteId: activeNote?.id ?? null,
            title: draftTitle,
            text: draftText,
        };

        clearPendingSaveTimeout();
        pendingSaveTimeoutIdRef.current = window.setTimeout(() => {
            pendingSaveTimeoutIdRef.current = null;

            if (pendingNoteSaveRef.current) {
                const scheduledPendingNoteSave = pendingNoteSaveRef.current;

                pendingNoteSaveRef.current = null;
                void persistNoteDraft(scheduledPendingNoteSave);
            }
        }, NOTE_SAVE_DEBOUNCE_MS);

        return () => {
            clearPendingSaveTimeout();
        };
    }, [activeNote?.id, activeNote?.text, activeNote?.title, activeWorkspaceId, draftText, draftTitle]);

    useEffect(() => () => {
        clearPendingSaveTimeout();
        clearPendingStatusResetTimeout();

        if (pendingNoteSaveRef.current) {
            const pendingNoteSave = pendingNoteSaveRef.current;

            pendingNoteSaveRef.current = null;
            void persistNoteDraft(pendingNoteSave);
        }
    }, []);

    return {
        draftTitle,
        draftText,
        saveStatus,
        setDraftTitle: updateDraftTitle,
        setDraftText: updateDraftText,
        flushNoteDraft,
    };
}
