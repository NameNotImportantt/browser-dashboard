import type { Bookmark, CreateBookmarkPayload } from "@/db/types/bookmark";

export interface BookmarksWidgetProps {
  bookmarks: Bookmark[];
  onAdd: (payload: CreateBookmarkPayload) => Promise<void>;
  onDelete: (bookmarkId: string) => Promise<void>;
}
