import type { CreateBookmarkPayload } from "@/db/types/bookmark";
import type { Bookmark } from "@/db/types/bookmark";

export interface QuickLinksProps {
  bookmarks: Bookmark[];
  onAdd: (payload: CreateBookmarkPayload) => Promise<void>;
  onDelete: (bookmarkId: string) => Promise<void>;
}
