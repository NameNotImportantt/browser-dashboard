import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useBookmarks() {
    const snapshot = useDashboardStore(dashboardStore => dashboardStore.snapshot);
    const activeWorkspaceId = useDashboardStore(dashboardStore => dashboardStore.activeWorkspaceId);

    const bookmarks = useMemo(() => {
        if (!activeWorkspaceId) {return [];}

        return [...(snapshot?.bookmarks.filter(bookmark => bookmark.workspaceId === activeWorkspaceId) ?? [])].sort(
            (firstBookmark, secondBookmark) => firstBookmark.position - secondBookmark.position,
        );
    }, [activeWorkspaceId, snapshot]);
    const categories = useMemo(() => {
        if (!activeWorkspaceId) {return [];}

        return [...(snapshot?.bookmarkCategories.filter(category => category.workspaceId === activeWorkspaceId) ?? [])].sort(
            (firstCategory, secondCategory) => firstCategory.position - secondCategory.position,
        );
    }, [activeWorkspaceId, snapshot]);
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
