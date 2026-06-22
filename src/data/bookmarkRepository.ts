import {createId, normalizeUrl} from '@/app';
import {db} from '@/db';
import type {Bookmark, CreateBookmarkCategoryPayload, CreateBookmarkPayload} from '@/db';

export async function addBookmark(
    payload: CreateBookmarkPayload,
    activeWorkspaceId: string | null,
    workspaceBookmarks: Bookmark[],
) {
    if (!activeWorkspaceId) {return;}

    const title = payload.title.trim();
    const url = normalizeUrl(payload.url);

    if (!title || !url) {return;}

    const categoryId = payload.categoryId ?? null;
    const categoryBookmarks = workspaceBookmarks.filter(item => item.categoryId === categoryId);

    await db.bookmarks.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        categoryId,
        title,
        url,
        position: categoryBookmarks.length,
        createdAt: Date.now(),
    });
}

export async function deleteBookmark(bookmarkId: string) {
    await db.bookmarks.delete(bookmarkId);
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
