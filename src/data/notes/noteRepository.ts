import {db, type Note, type NoteDraft, type NotePatch} from '@/db';
import {createId} from '@/lib';

function getNextNotePosition(notes: Note[]) {
    if (notes.length === 0) {
        return 0;
    }

    return Math.max(...notes.map(note => note.position)) + 1;
}

export async function createNote(draft: NoteDraft, workspaceId: string | null, notes: Note[]) {
    if (!workspaceId) {return null;}

    const id = createId();
    const now = Date.now();
    const position = getNextNotePosition(notes);

    const note: Note = {
        id,
        workspaceId,
        title: draft.title,
        text: draft.text,
        createdAt: now,
        updatedAt: now,
        position,
    };

    await db.notes.add(note);

    return note;
}

export async function updateNote(noteId: string, patch: NotePatch) {
    if (!('title' in patch) && !('text' in patch)) {
        return null;
    }

    const currentNote = await db.notes.get(noteId);

    if (!currentNote) {
        return null;
    }

    const nextNote: Note = {
        ...currentNote,
        ...patch,
        updatedAt: Date.now(),
    };

    await db.notes.update(noteId, {
        ...patch,
        updatedAt: nextNote.updatedAt,
    });

    return nextNote;
}

export async function deleteNote(noteId: string) {
    await db.notes.delete(noteId);
}
