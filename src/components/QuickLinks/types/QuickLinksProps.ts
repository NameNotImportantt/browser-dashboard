import type { CreateBookmarkPayload } from "@/db/types/bookmark";
import type { Bookmark } from "@/db/types/bookmark";
import type { BookmarkCategory, CreateBookmarkCategoryPayload } from "@/db/types/bookmarkCategory";
import type { AppLocale } from "@/db/types/settings";

export interface QuickLinksProps {
  bookmarks: Bookmark[];
  categories: BookmarkCategory[];
  locale: AppLocale;
  onAdd: (payload: CreateBookmarkPayload) => Promise<void>;
  onDelete: (bookmarkId: string) => Promise<void>;
  onAddCategory: (payload: CreateBookmarkCategoryPayload) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}
