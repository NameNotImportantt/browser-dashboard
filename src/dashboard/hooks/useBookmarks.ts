import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';
import {selectSortedWorkspaceScopedItems} from './lib/workspaceCollections';

export function useBookmarks() {
    const bookmarksCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.bookmarks ?? []);
    const bookmarkCategoriesCollection = useDashboardStore(dashboardStore => dashboardStore.snapshot?.bookmarkCategories ?? []);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const bookmarks = useMemo(
        () => selectSortedWorkspaceScopedItems(bookmarksCollection, activeWorkspaceId),
        [activeWorkspaceId, bookmarksCollection],
    );
    const categories = useMemo(
        () => selectSortedWorkspaceScopedItems(bookmarkCategoriesCollection, activeWorkspaceId),
        [activeWorkspaceId, bookmarkCategoriesCollection],
    );
    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            addBookmark: dashboardStore.addBookmark,
            deleteBookmark: dashboardStore.deleteBookmark,
            refreshBookmarkFavicon: dashboardStore.refreshBookmarkFavicon,
            refreshBookmarkFavicons: dashboardStore.refreshBookmarkFavicons,
            addBookmarkCategory: dashboardStore.addBookmarkCategory,
            deleteBookmarkCategory: dashboardStore.deleteBookmarkCategory,
        })),
    );

    return {
        bookmarks,
        categories,
        ...actions,
    };
}
