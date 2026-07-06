import {sortByPosition} from '@/data';
import * as bookmarkRepository from '@/data/bookmarks/bookmarkRepository';
import * as searchHistoryRepository from '@/data/searchHistory/searchHistoryRepository';
import * as todoRepository from '@/data/todos/todoRepository';
import * as workspaceRepository from '@/data/workspaces/workspaceRepository';
import {createId} from '@/lib';
import {appendSortedSnapshotCollectionItem, patchSnapshot, patchSnapshotCollection} from '../lib/snapshotMutations';
import {UndoActionKind, type SliceCreator, type UndoEntry, type UndoSlice} from '../types';

const UNDO_TIMEOUT_MS = 6000;

async function restoreUndoEntry(undoEntry: UndoEntry) {
    if (undoEntry.kind === UndoActionKind.TodoDelete) {
        await todoRepository.restoreTodo(undoEntry.todo);
        return;
    }

    if (undoEntry.kind === UndoActionKind.BookmarkDelete) {
        await bookmarkRepository.restoreBookmark(undoEntry.bookmark);
        return;
    }

    if (undoEntry.kind === UndoActionKind.BookmarkCategoryDelete) {
        await bookmarkRepository.restoreBookmarkCategory(undoEntry.category, undoEntry.bookmarkIds);
        return;
    }

    if (undoEntry.kind === UndoActionKind.WorkspaceDelete) {
        await workspaceRepository.restoreWorkspaceSubtree({
            workspace: undoEntry.workspace,
            todos: undoEntry.todos,
            habits: undoEntry.habits,
            bookmarks: undoEntry.bookmarks,
            bookmarkCategories: undoEntry.bookmarkCategories,
            notes: undoEntry.notes,
            wasActive: undoEntry.wasActive,
        });
        return;
    }

    await searchHistoryRepository.restoreSearchHistoryEntries(undoEntry.entries);
}

export const createUndoSlice: SliceCreator<UndoSlice> = (set, get) => ({
    currentUndoEntry: null,
    enqueueUndoEntry: entry => {
        const now = Date.now();

        const nextUndoEntry: UndoEntry = {
            ...entry,
            id: createId(),
            createdAt: now,
            expiresAt: now + UNDO_TIMEOUT_MS,
        } as UndoEntry;

        set({
            currentUndoEntry: nextUndoEntry,
        });
    },
    clearExpiredUndoEntry: () => {
        const currentUndoEntry = get().currentUndoEntry;

        if (!currentUndoEntry || currentUndoEntry.expiresAt > Date.now()) {
            return;
        }

        set({
            currentUndoEntry: null,
        });
    },
    clearCurrentUndoEntry: () => {
        set({
            currentUndoEntry: null,
        });
    },
    undoCurrentUndoEntry: async () => {
        const currentUndoEntry = get().currentUndoEntry;

        if (!currentUndoEntry || currentUndoEntry.expiresAt <= Date.now()) {
            set({currentUndoEntry: null});
            return;
        }

        set({
            currentUndoEntry: null,
        });

        await restoreUndoEntry(currentUndoEntry);

        if (currentUndoEntry.kind === UndoActionKind.TodoDelete) {
            appendSortedSnapshotCollectionItem(set, 'todos', currentUndoEntry.todo);
            return;
        }

        if (currentUndoEntry.kind === UndoActionKind.BookmarkDelete) {
            appendSortedSnapshotCollectionItem(set, 'bookmarks', currentUndoEntry.bookmark);
            return;
        }

        if (currentUndoEntry.kind === UndoActionKind.BookmarkCategoryDelete) {
            appendSortedSnapshotCollectionItem(set, 'bookmarkCategories', currentUndoEntry.category);
            patchSnapshotCollection(
                set,
                'bookmarks',
                bookmarks => bookmarks.map(bookmark => (
                    currentUndoEntry.bookmarkIds.includes(bookmark.id)
                        ? {
                            ...bookmark,
                            categoryId: currentUndoEntry.category.id,
                        }
                        : bookmark
                )),
            );
            return;
        }

        if (currentUndoEntry.kind === UndoActionKind.WorkspaceDelete) {
            patchSnapshot(set, snapshot => ({
                ...snapshot,
                workspaces: sortByPosition([...snapshot.workspaces, currentUndoEntry.workspace]),
                todos: sortByPosition([...snapshot.todos, ...currentUndoEntry.todos]),
                habits: sortByPosition([...snapshot.habits, ...currentUndoEntry.habits]),
                bookmarks: sortByPosition([...snapshot.bookmarks, ...currentUndoEntry.bookmarks]),
                bookmarkCategories: sortByPosition([...snapshot.bookmarkCategories, ...currentUndoEntry.bookmarkCategories]),
                notes: sortByPosition([...snapshot.notes, ...currentUndoEntry.notes]),
                settings: currentUndoEntry.wasActive
                    ? {
                        ...snapshot.settings,
                        lastWorkspaceId: currentUndoEntry.workspace.id,
                    }
                    : snapshot.settings,
            }));

            if (currentUndoEntry.wasActive) {
                set({
                    activeWorkspaceId: currentUndoEntry.workspace.id,
                });
            }

            return;
        }

        patchSnapshotCollection(
            set,
            'searchHistory',
            searchHistory => [...searchHistory, ...currentUndoEntry.entries]
                .sort((firstEntry, secondEntry) => secondEntry.usedAt - firstEntry.usedAt),
        );
    },
});
