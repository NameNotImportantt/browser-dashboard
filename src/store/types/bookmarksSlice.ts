import type {CreateBookmarkCategoryPayload, CreateBookmarkPayload} from '@/db';

export interface BookmarksSlice {
  addBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;
  addBookmarkCategory: (payload: CreateBookmarkCategoryPayload) => Promise<void>;
  deleteBookmarkCategory: (categoryId: string) => Promise<void>;
}
