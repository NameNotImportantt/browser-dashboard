import {db} from '@/db';
import {createId} from '@/lib';
import {normalizeUrl} from './lib/normalizeUrl';
import {resolveBookmarkFaviconUrl} from './lib/resolveBookmarkFaviconUrl';
import type {Bookmark, BookmarkCategory, CreateBookmarkCategoryPayload, CreateBookmarkPayload} from '@/db';

export async function addBookmark(
    payload: CreateBookmarkPayload,
    activeWorkspaceId: string | null,
    workspaceBookmarks: Bookmark[],
) {
    if (!activeWorkspaceId) {return null;}

    const title = payload.title.trim();
    const url = normalizeUrl(payload.url);

    if (!title || !url) {return null;}

    const categoryId = payload.categoryId ?? null;
    const categoryBookmarks = workspaceBookmarks.filter(item => item.categoryId === categoryId);
    const id = createId();

    await db.bookmarks.add({
        id,
        workspaceId: activeWorkspaceId,
        categoryId,
        title,
        url,
        faviconUrl: null,
        position: categoryBookmarks.length,
        createdAt: Date.now(),
    });

    return id;
}

export async function deleteBookmark(bookmarkId: string) {
    await db.bookmarks.delete(bookmarkId);
}

export async function restoreBookmark(bookmark: Bookmark) {
    await db.bookmarks.put(bookmark);
}

export async function refreshBookmarkFavicon(bookmarkId: string) {
    const bookmark = await db.bookmarks.get(bookmarkId);

    if (!bookmark) {return;}

    const faviconUrl = resolveBookmarkFaviconUrl(bookmark.url);

    await db.bookmarks.update(bookmarkId, {faviconUrl});
}

export async function addBookmarkCategory(
    payload: CreateBookmarkCategoryPayload,
    activeWorkspaceId: string | null,
    position: number,
) {
    if (!activeWorkspaceId) {return;}

    const name = payload.name.trim();

    if (!name) {return;}

    await db.bookmarkCategories.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        name,
        position,
        createdAt: Date.now(),
    });
}

export async function deleteBookmarkCategory(categoryId: string) {
    await db.transaction('rw', [db.bookmarks, db.bookmarkCategories], async () => {
        await db.bookmarks.where('categoryId').equals(categoryId).modify({categoryId: null});
        await db.bookmarkCategories.delete(categoryId);
    });
}

export async function restoreBookmarkCategory(category: BookmarkCategory, bookmarkIds: string[]) {
    await db.transaction('rw', [db.bookmarkCategories, db.bookmarks], async () => {
        await db.bookmarkCategories.put(category);

        for (const bookmarkId of bookmarkIds) {
            await db.bookmarks.update(bookmarkId, {categoryId: category.id});
        }
    });
}
