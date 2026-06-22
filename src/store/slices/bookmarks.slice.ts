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
        await repository.addBookmark(payload, get().activeWorkspaceId, getWorkspaceBookmarks(get()));
        await get().refresh();
    },
    deleteBookmark: async bookmarkId => {
        await repository.deleteBookmark(bookmarkId);
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
