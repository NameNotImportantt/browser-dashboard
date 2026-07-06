import * as repository from '@/data/bookmarks/bookmarkRepository';
import {DEFAULT_SETTINGS} from '@/data/settings';
import {
    appendSnapshotCollectionItem,
    mapSnapshotCollectionItem,
    patchSnapshotCollection,
    removeSnapshotCollectionItem,
} from '../lib/snapshotMutations';
import {UndoActionKind, type BookmarksSlice, type DashboardStore, type SliceCreator} from '../types';

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
        const bookmark = await repository.addBookmark(payload, get().activeWorkspaceId, getWorkspaceBookmarks(get()));
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        if (!bookmark) {
            return;
        }

        appendSnapshotCollectionItem(_set, 'bookmarks', bookmark);

        if (bookmarkFaviconsEnabled) {
            void repository.refreshBookmarkFavicon(bookmark.id)
                .then(nextBookmark => {
                    if (!nextBookmark) {
                        return;
                    }

                    mapSnapshotCollectionItem(_set, 'bookmarks', nextBookmark.id, () => nextBookmark);
                })
                .catch(() => undefined);
        }
    },
    deleteBookmark: async bookmarkId => {
        const bookmark = getWorkspaceBookmarks(get()).find(workspaceBookmark => workspaceBookmark.id === bookmarkId);

        await repository.deleteBookmark(bookmarkId);

        if (bookmark) {
            get().enqueueUndoEntry({
                kind: UndoActionKind.BookmarkDelete,
                bookmark,
            });
        }

        removeSnapshotCollectionItem(_set, 'bookmarks', bookmarkId);
    },
    refreshBookmarkFavicon: async bookmarkId => {
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        if (!bookmarkFaviconsEnabled) {return;}

        const bookmark = await repository.refreshBookmarkFavicon(bookmarkId);

        if (!bookmark) {
            return;
        }

        mapSnapshotCollectionItem(_set, 'bookmarks', bookmarkId, () => bookmark);
    },
    refreshBookmarkFavicons: async bookmarkIds => {
        const bookmarkFaviconsEnabled = get().snapshot?.settings.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled;

        if (!bookmarkFaviconsEnabled) {return;}

        const settledBookmarks = await Promise.allSettled(bookmarkIds.map(bookmarkId => repository.refreshBookmarkFavicon(bookmarkId)));

        const refreshedBookmarks = settledBookmarks
            .flatMap(result => (result.status === 'fulfilled' && result.value ? [result.value] : []));

        if (refreshedBookmarks.length === 0) {
            return;
        }

        patchSnapshotCollection(_set, 'bookmarks', bookmarks => bookmarks.map(bookmark => {
            const refreshedBookmark = refreshedBookmarks.find(candidate => candidate.id === bookmark.id);

            return refreshedBookmark ?? bookmark;
        }));
    },
    addBookmarkCategory: async payload => {
        const category = await repository.addBookmarkCategory(
            payload,
            get().activeWorkspaceId,
            getWorkspaceBookmarkCategories(get()).length,
        );

        if (!category) {
            return;
        }

        appendSnapshotCollectionItem(_set, 'bookmarkCategories', category);
    },
    deleteBookmarkCategory: async categoryId => {
        const category = getWorkspaceBookmarkCategories(get()).find(workspaceCategory => workspaceCategory.id === categoryId);

        const bookmarkIds = getWorkspaceBookmarks(get())
            .filter(workspaceBookmark => workspaceBookmark.categoryId === categoryId)
            .map(workspaceBookmark => workspaceBookmark.id);

        await repository.deleteBookmarkCategory(categoryId);

        if (category) {
            get().enqueueUndoEntry({
                kind: UndoActionKind.BookmarkCategoryDelete,
                category,
                bookmarkIds,
            });
        }

        removeSnapshotCollectionItem(_set, 'bookmarkCategories', categoryId);
        patchSnapshotCollection(
            _set,
            'bookmarks',
            bookmarks => bookmarks.map(bookmark => (
                bookmark.categoryId === categoryId
                    ? {
                        ...bookmark,
                        categoryId: null,
                    }
                    : bookmark
            )),
        );
    },
});
