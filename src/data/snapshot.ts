import {trackFullSnapshotReload} from '@/app/bootstrap/devPerformance';
import {loadPositionedTableRows} from '@/data/lib/loadPositionedTableRows';
import {DEFAULT_SETTINGS, mergeSettings} from '@/data/settings';
import {db} from '@/db';
import {createId} from '@/lib';
import type {
    AppSettings,
    Bookmark,
    BookmarkCategory,
    Habit,
    Note,
    SearchHistoryEntry,
    TodoItem,
    WeatherCache,
    Workspace,
} from '@/db';

export interface Snapshot {
  workspaces: Workspace[];
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  bookmarkCategories: BookmarkCategory[];
  notes: Note[];
  settings: AppSettings;
  weatherCache: WeatherCache | null;
  searchHistory: SearchHistoryEntry[];
}

export enum SnapshotLoadMode {
    Critical = 'critical',
    Full = 'full',
}

export function sortByPosition<T extends { position: number }>(items: T[]) {
    return [...items].sort((a, b) => a.position - b.position);
}

export async function ensureSeedData() {
    const workspacesCount = await db.workspaces.count();
    let firstWorkspaceId: string | null = null;

    if (workspacesCount === 0) {
        const id = createId();
        const now = Date.now();

        await db.workspaces.add({
            id,
            name: 'main',
            position: 0,
            createdAt: now,
        });
        firstWorkspaceId = id;
    }

    const currentSettings = await db.settings.get('app');

    if (!currentSettings) {
        await db.settings.put({
            ...DEFAULT_SETTINGS,
            lastWorkspaceId: firstWorkspaceId,
            updatedAt: Date.now(),
        });
    }
}

export async function loadSnapshot(mode = SnapshotLoadMode.Full): Promise<Snapshot> {
    const startedAt = performance.now();
    const isFullLoad = mode === SnapshotLoadMode.Full;

    const [workspaces, todos, habits, bookmarks, bookmarkCategories, notes, settings, weatherCache, searchHistory] =
        await Promise.all([
            loadPositionedTableRows(db.workspaces),
            loadPositionedTableRows(db.todos),
            isFullLoad ? loadPositionedTableRows(db.habits) : Promise.resolve([]),
            loadPositionedTableRows(db.bookmarks),
            loadPositionedTableRows(db.bookmarkCategories),
            isFullLoad ? loadPositionedTableRows(db.notes) : Promise.resolve([]),
            db.settings.get('app'),
            db.weatherCache.get('current'),
            isFullLoad ? db.searchHistory.orderBy('usedAt').reverse().toArray() : Promise.resolve([]),
        ]);

    trackFullSnapshotReload(performance.now() - startedAt, {
        mode,
        tableCount: 9,
        workspaceCount: workspaces.length,
        todoCount: todos.length,
        habitCount: habits.length,
        bookmarkCount: bookmarks.length,
        bookmarkCategoryCount: bookmarkCategories.length,
        noteCount: notes.length,
        weatherCacheLoaded: weatherCache !== undefined && weatherCache !== null,
        searchHistoryCount: searchHistory.length,
    });

    return {
        workspaces,
        todos,
        habits,
        bookmarks,
        bookmarkCategories,
        notes,
        settings: mergeSettings(settings),
        weatherCache: weatherCache ?? null,
        searchHistory,
    };
}
