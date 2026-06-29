import {NOTE_PREVIEW_MAX_LINES} from '../const/NOTE_PREVIEW_MAX_LINES';
import type {Note} from '@/db';

function getFirstNonEmptyLine(text: string) {
    return text
        .split(/\r?\n/)
        .map(line => line.trim())
        .find(Boolean);
}

export function getNoteTitle(note: Note, untitledLabel: string) {
    const explicitTitle = note.title.trim();

    if (explicitTitle) {
        return explicitTitle;
    }

    return getFirstNonEmptyLine(note.text) ?? untitledLabel;
}

export function getNotePreview(text: string) {
    return text
        .split(/\r?\n/)
        .slice(0, NOTE_PREVIEW_MAX_LINES)
        .join('\n')
        .trim();
}
