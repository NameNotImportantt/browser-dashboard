export interface NotesSlice {
  saveNote: (text: string) => Promise<void>;
}
