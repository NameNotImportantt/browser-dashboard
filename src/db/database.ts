import Dexie, {type Table} from 'dexie';
import type {AppSettings, Bookmark, BookmarkCategory, Habit, Note, SearchHistoryEntry, TodoItem, WeatherCache, Workspace} from './types';

export class DashboardDatabase extends Dexie {
    public workspaces!: Table<Workspace, string>;
    public todos!: Table<TodoItem, string>;
    public notes!: Table<Note, string>;
    public habits!: Table<Habit, string>;
    public bookmarks!: Table<Bookmark, string>;
    public bookmarkCategories!: Table<BookmarkCategory, string>;
    public settings!: Table<AppSettings, string>;
    public weatherCache!: Table<WeatherCache, string>;
    public searchHistory!: Table<SearchHistoryEntry, string>;

    public constructor() {
        super('browser-home-page-db');

        this.version(1).stores({
            workspaces: 'id,position,createdAt',
            todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
            notes: 'id,workspaceId,updatedAt',
            habits: 'id,workspaceId,position,createdAt',
            bookmarks: 'id,workspaceId,position,createdAt',
            settings: 'key,updatedAt',
            weatherCache: 'id,fetchedAt',
        });

        this.version(2)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: Record<string, unknown>) => {
                        const legacySearchEngine = settings.searchEngine as string | undefined;

                        settings.activeSearchEngineId = settings.activeSearchEngineId ?? legacySearchEngine ?? 'duckduckgo';
                        settings.customSearchEngines = settings.customSearchEngines ?? [];
                        settings.onlineSearchSuggestionsEnabled = settings.onlineSearchSuggestionsEnabled ?? true;
                        settings.timeFormat = settings.timeFormat ?? '24h';
                        settings.timezone = settings.timezone ?? 'auto';
                        settings.locale = settings.locale ?? 'ru';
                        settings.dateFormat = settings.dateFormat ?? 'dd.MM.yyyy';
                        settings.tabTitle = settings.tabTitle ?? 'Personal Dashboard';

                        delete settings.searchEngine;
                    });
            });

        this.version(3)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('bookmarks')
                    .toCollection()
                    .modify((bookmark: Record<string, unknown>) => {
                        bookmark.categoryId = bookmark.categoryId ?? null;
                    });
            });

        this.version(4)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: Record<string, unknown>) => {
                        settings.backgroundScrimOpacity = settings.backgroundScrimOpacity ?? 65;
                    });
            });

        this.version(5).stores({
            workspaces: 'id,position,createdAt',
            todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
            notes: 'id,workspaceId,updatedAt',
            habits: 'id,workspaceId,position,createdAt',
            bookmarks: 'id,workspaceId,categoryId,position,createdAt',
            bookmarkCategories: 'id,workspaceId,position,createdAt',
            settings: 'key,updatedAt',
            weatherCache: 'id,fetchedAt',
            searchHistory: 'id,usedAt',
        });

        this.version(6)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
                searchHistory: 'id,usedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: Record<string, unknown>) => {
                        settings.searchHistoryEnabled = settings.searchHistoryEnabled ?? true;
                    });
            });

        this.version(7)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
                searchHistory: 'id,usedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: Record<string, unknown>) => {
                        settings.onlineSearchSuggestionsEnabled = settings.onlineSearchSuggestionsEnabled ?? true;
                    });
            });

        this.version(8)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,updatedAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
                searchHistory: 'id,usedAt',
            })
            .upgrade(async transaction => {
                await transaction
                    .table('bookmarks')
                    .toCollection()
                    .modify((bookmark: Record<string, unknown>) => {
                        bookmark.faviconUrl = bookmark.faviconUrl ?? bookmark.faviconDataUrl ?? null;
                        delete bookmark.faviconDataUrl;
                    });
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: Record<string, unknown>) => {
                        settings.bookmarkFaviconsEnabled = settings.bookmarkFaviconsEnabled ?? true;
                    });
            });
    }
}

export const db = new DashboardDatabase();
