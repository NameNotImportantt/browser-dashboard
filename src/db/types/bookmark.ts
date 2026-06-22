export interface Bookmark {
  id: string;
  workspaceId: string;
  categoryId: string | null;
  title: string;
  url: string;
  faviconUrl: string | null;
  position: number;
  createdAt: number;
}

export interface CreateBookmarkPayload {
  title: string;
  url: string;
  categoryId?: string | null;
}
