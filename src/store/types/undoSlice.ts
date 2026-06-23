import type {UndoActionKind} from './undoActionKind';
import type {Bookmark, BookmarkCategory, Habit, Note, SearchHistoryEntry, TodoItem, Workspace} from '@/db';

export interface UndoTodoDeleteEntry {
    id: string;
    kind: UndoActionKind.TodoDelete;
    createdAt: number;
    expiresAt: number;
    todo: TodoItem;
}

export interface UndoBookmarkDeleteEntry {
    id: string;
    kind: UndoActionKind.BookmarkDelete;
    createdAt: number;
    expiresAt: number;
    bookmark: Bookmark;
}

export interface UndoBookmarkCategoryDeleteEntry {
    id: string;
    kind: UndoActionKind.BookmarkCategoryDelete;
    createdAt: number;
    expiresAt: number;
    category: BookmarkCategory;
    bookmarkIds: string[];
}

export interface UndoWorkspaceDeleteEntry {
    id: string;
    kind: UndoActionKind.WorkspaceDelete;
    createdAt: number;
    expiresAt: number;
    workspace: Workspace;
    todos: TodoItem[];
    habits: Habit[];
    bookmarks: Bookmark[];
    bookmarkCategories: BookmarkCategory[];
    notes: Note[];
    wasActive: boolean;
}

export interface UndoSearchHistoryDeleteEntry {
    id: string;
    kind: UndoActionKind.SearchHistoryDelete;
    createdAt: number;
    expiresAt: number;
    entries: SearchHistoryEntry[];
    clearedAll: boolean;
}

export type UndoEntry =
    | UndoTodoDeleteEntry
    | UndoBookmarkDeleteEntry
    | UndoBookmarkCategoryDeleteEntry
    | UndoWorkspaceDeleteEntry
    | UndoSearchHistoryDeleteEntry;

export type UndoEntryInput =
    | Omit<UndoTodoDeleteEntry, 'id' | 'createdAt' | 'expiresAt'>
    | Omit<UndoBookmarkDeleteEntry, 'id' | 'createdAt' | 'expiresAt'>
    | Omit<UndoBookmarkCategoryDeleteEntry, 'id' | 'createdAt' | 'expiresAt'>
    | Omit<UndoWorkspaceDeleteEntry, 'id' | 'createdAt' | 'expiresAt'>
    | Omit<UndoSearchHistoryDeleteEntry, 'id' | 'createdAt' | 'expiresAt'>;

export interface UndoSlice {
    currentUndoEntry: UndoEntry | null;
    enqueueUndoEntry: (entry: UndoEntryInput) => void;
    clearExpiredUndoEntry: () => void;
    clearCurrentUndoEntry: () => void;
    undoCurrentUndoEntry: () => Promise<void>;
}
