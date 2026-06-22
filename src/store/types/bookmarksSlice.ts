import type {CreateBookmarkCategoryPayload, CreateBookmarkPayload} from '@/db';

export interface BookmarksSlice {
  addBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;
  refreshBookmarkFavicon: (bookmarkId: string) => Promise<void>;
  refreshBookmarkFavicons: (bookmarkIds: string[]) => Promise<void>;
  addBookmarkCategory: (payload: CreateBookmarkCategoryPayload) => Promise<void>;
  deleteBookmarkCategory: (categoryId: string) => Promise<void>;
}
