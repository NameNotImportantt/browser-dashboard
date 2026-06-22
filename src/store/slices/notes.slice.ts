import * as repository from '@/data/noteRepository';
import type {NotesSlice, SliceCreator} from '../types';

export const createNotesSlice: SliceCreator<NotesSlice> = (_set, get) => ({
    saveNote: async text => {
        await repository.saveNote(text, get().activeWorkspaceId);
        await get().refresh();
    },
});
