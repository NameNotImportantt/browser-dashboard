export interface BookmarkCategory {
  id: string;
  workspaceId: string;
  name: string;
  position: number;
  createdAt: number;
}

export interface CreateBookmarkCategoryPayload {
  name: string;
}
