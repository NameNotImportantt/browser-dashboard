import type {NoteDraft, NotePatch} from '@/db';

export interface NotesSlice {
  activeNoteId: string | null;
  selectNote: (noteId: string | null) => void;
  createNote: (draft?: NoteDraft) => Promise<string | null>;
  updateNote: (noteId: string, patch: NotePatch) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}
