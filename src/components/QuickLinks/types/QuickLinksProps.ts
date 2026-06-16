import type { AppLocale, Bookmark, BookmarkCategory, CreateBookmarkCategoryPayload, CreateBookmarkPayload } from "@/db/types";

export interface QuickLinksProps {
  bookmarks: Bookmark[];
  categories: BookmarkCategory[];
  locale: AppLocale;
  onAdd: (payload: CreateBookmarkPayload) => Promise<void>;
  onDelete: (bookmarkId: string) => Promise<void>;
  onAddCategory: (payload: CreateBookmarkCategoryPayload) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}
