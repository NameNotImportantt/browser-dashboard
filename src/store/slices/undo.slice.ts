import {createId} from '@/app';
import * as bookmarkRepository from '@/data/bookmarkRepository';
import * as searchHistoryRepository from '@/data/searchHistoryRepository';
import * as todoRepository from '@/data/todoRepository';
import * as workspaceRepository from '@/data/workspaceRepository';
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
        await get().refresh();
    },
});
