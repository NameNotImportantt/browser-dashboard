export interface Note {
  id: string;
  workspaceId: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  position: number;
}

export interface NoteDraft {
  title: string;
  text: string;
}

export interface NotePatch {
  title?: string;
  text?: string;
}
