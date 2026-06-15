export interface Bookmark {
  id: string;
  workspaceId: string;
  title: string;
  url: string;
  position: number;
  createdAt: number;
}

export interface CreateBookmarkPayload {
  title: string;
  url: string;
}
