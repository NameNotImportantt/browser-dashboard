import {trackFullSnapshotReload} from '@/app/bootstrap/devPerformance';
import {loadPositionedTableRows} from '@/data/lib/loadPositionedTableRows';
import {DEFAULT_SETTINGS, mergeSettings} from '@/data/settings';
import {normalizeWeatherCache} from '@/data/weather';
import {db} from '@/db';
import {createId} from '@/lib';
import type {
    AppSettings,
    Bookmark,
    BookmarkCategory,
    Habit,
    HomeBootstrapCacheRecord,
    HomeBootstrapSnapshot,
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

const HOME_BOOTSTRAP_CACHE_ID = 'home-critical';
const HOME_BOOTSTRAP_CACHE_SCHEMA_VERSION = 1;

export function sortByPosition<T extends { position: number }>(items: T[]) {
    return [...items].sort((a, b) => a.position - b.position);
}

export function createHomeBootstrapSnapshot(snapshot: Snapshot): HomeBootstrapSnapshot {
    return {
        workspaces: snapshot.workspaces,
        todos: snapshot.todos,
        bookmarks: snapshot.bookmarks,
        bookmarkCategories: snapshot.bookmarkCategories,
        settings: snapshot.settings,
        weatherCache: snapshot.weatherCache,
    };
}

export function createSnapshotFromHomeBootstrapSnapshot(homeBootstrapSnapshot: HomeBootstrapSnapshot): Snapshot {
    return {
        ...homeBootstrapSnapshot,
        habits: [],
        notes: [],
        searchHistory: [],
    };
}

function normalizeHomeBootstrapCacheRecord(record: HomeBootstrapCacheRecord) {
    return {
        ...record,
        snapshot: {
            ...record.snapshot,
            settings: mergeSettings(record.snapshot.settings),
            weatherCache: normalizeWeatherCache(record.snapshot.weatherCache),
        },
    };
}

export async function loadHomeBootstrapSnapshot() {
    const record = await db.bootstrapCache.get(HOME_BOOTSTRAP_CACHE_ID);

    if (!record) {
        return null;
    }

    if (record.schemaVersion !== HOME_BOOTSTRAP_CACHE_SCHEMA_VERSION) {
        await db.bootstrapCache.delete(HOME_BOOTSTRAP_CACHE_ID);
        return null;
    }

    return normalizeHomeBootstrapCacheRecord(record);
}

export async function saveHomeBootstrapSnapshot(snapshot: Snapshot, activeWorkspaceId: string | null) {
    const record: HomeBootstrapCacheRecord = {
        id: HOME_BOOTSTRAP_CACHE_ID,
        schemaVersion: HOME_BOOTSTRAP_CACHE_SCHEMA_VERSION,
        cachedAt: Date.now(),
        activeWorkspaceId,
        snapshot: createHomeBootstrapSnapshot(snapshot),
    };

    await db.bootstrapCache.put(record);

    return record;
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
        weatherCache: normalizeWeatherCache(weatherCache),
        searchHistory,
    };
}
