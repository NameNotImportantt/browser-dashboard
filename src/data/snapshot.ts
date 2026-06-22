import {createId, DEFAULT_SETTINGS, mergeSettings} from '@/app';
import {db} from '@/db';
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

export async function loadSnapshot(): Promise<Snapshot> {
    const [workspaces, todos, habits, bookmarks, bookmarkCategories, notes, settings, weatherCache, searchHistory] =
    await Promise.all([
        db.workspaces.toArray(),
        db.todos.toArray(),
        db.habits.toArray(),
        db.bookmarks.toArray(),
        db.bookmarkCategories.toArray(),
        db.notes.toArray(),
        db.settings.get('app'),
        db.weatherCache.get('current'),
        db.searchHistory.orderBy('usedAt').reverse().toArray(),
    ]);

    return {
        workspaces: sortByPosition(workspaces),
        todos: sortByPosition(todos),
        habits: sortByPosition(habits),
        bookmarks: sortByPosition(bookmarks),
        bookmarkCategories: sortByPosition(bookmarkCategories),
        notes,
        settings: mergeSettings(settings),
        weatherCache: weatherCache ?? null,
        searchHistory,
    };
}
