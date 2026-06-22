import {DEFAULT_SETTINGS} from '@/app';
import * as repository from '@/data/bookmarkRepository';
import type {BookmarksSlice, DashboardStore, SliceCreator} from '../types';

function getWorkspaceBookmarks(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.bookmarks.filter(bookmark => bookmark.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

function getWorkspaceBookmarkCategories(dashboardStore: DashboardStore) {
    if (!dashboardStore.activeWorkspaceId) {return [];}

    return dashboardStore.snapshot?.bookmarkCategories.filter(category => category.workspaceId === dashboardStore.activeWorkspaceId) ?? [];
}

export const createBookmarksSlice: SliceCreator<BookmarksSlice> = (_set, get) => ({
    addBookmark: async payload => {
        const bookmarkId = await repository.addBookmark(payload, get().activeWorkspaceId, getWorkspaceBookmarks(get()));
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        await get().refresh();

        if (bookmarkId && bookmarkFaviconsEnabled) {
            void repository.refreshBookmarkFavicon(bookmarkId)
                .then(() => get().refresh())
                .catch(() => undefined);
        }
    },
    deleteBookmark: async bookmarkId => {
        await repository.deleteBookmark(bookmarkId);
        await get().refresh();
    },
    refreshBookmarkFavicon: async bookmarkId => {
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        if (!bookmarkFaviconsEnabled) {return;}

        await repository.refreshBookmarkFavicon(bookmarkId);
        await get().refresh();
    },
    refreshBookmarkFavicons: async bookmarkIds => {
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        if (!bookmarkFaviconsEnabled) {return;}

        await Promise.allSettled(bookmarkIds.map(bookmarkId => repository.refreshBookmarkFavicon(bookmarkId)));
        await get().refresh();
    },
    addBookmarkCategory: async payload => {
        await repository.addBookmarkCategory(payload, get().activeWorkspaceId, getWorkspaceBookmarkCategories(get()).length);
        await get().refresh();
    },
    deleteBookmarkCategory: async categoryId => {
        await repository.deleteBookmarkCategory(categoryId);
        await get().refresh();
    },
});
