import Dexie, {type Table} from 'dexie';
import type {AppSettings, Bookmark, BookmarkCategory, Habit, Note, SearchHistoryEntry, TodoItem, WeatherCache, Workspace} from './types';

interface LegacyNoteRecord {
    id: string;
    workspaceId: string;
    text: string;
    updatedAt: number;
    title?: string;
    createdAt?: number;
    position?: number;
}

interface LegacySettingsRecord {
    searchEngine?: string;
    activeSearchEngineId?: string;
    customSearchEngines?: AppSettings['customSearchEngines'];
    onlineSearchSuggestionsEnabled?: boolean;
    timeFormat?: AppSettings['timeFormat'];
    timezone?: string;
    locale?: AppSettings['locale'];
    dateFormat?: AppSettings['dateFormat'];
    tabTitle?: string;
    backgroundScrimOpacity?: number;
    searchHistoryEnabled?: boolean;
    bookmarkFaviconsEnabled?: boolean;
    backupReminderEnabled?: boolean;
    backupReminderIntervalDays?: number;
    lastBackupExportedAt?: number | null;
}

interface LegacyBookmarkRecord {
    categoryId?: string | null;
    faviconUrl?: string | null;
    faviconDataUrl?: string | null;
}

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
                    .modify((settings: LegacySettingsRecord) => {
                        const legacySearchEngine = settings.searchEngine;

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
                    .modify((bookmark: LegacyBookmarkRecord) => {
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
                    .modify((settings: LegacySettingsRecord) => {
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
                    .modify((settings: LegacySettingsRecord) => {
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
                    .modify((settings: LegacySettingsRecord) => {
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
                    .modify((bookmark: LegacyBookmarkRecord) => {
                        bookmark.faviconUrl = bookmark.faviconUrl ?? bookmark.faviconDataUrl ?? null;
                        delete bookmark.faviconDataUrl;
                    });
                await transaction
                    .table('settings')
                    .toCollection()
                    .modify((settings: LegacySettingsRecord) => {
                        settings.bookmarkFaviconsEnabled = settings.bookmarkFaviconsEnabled ?? true;
                    });
            });

        this.version(9)
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
                    .modify((settings: LegacySettingsRecord) => {
                        settings.backupReminderEnabled = settings.backupReminderEnabled ?? true;
                        settings.backupReminderIntervalDays = settings.backupReminderIntervalDays ?? 7;
                        settings.lastBackupExportedAt = settings.lastBackupExportedAt ?? null;
                    });
            });

        this.version(10)
            .stores({
                workspaces: 'id,position,createdAt',
                todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
                notes: 'id,workspaceId,position,updatedAt,createdAt',
                habits: 'id,workspaceId,position,createdAt',
                bookmarks: 'id,workspaceId,categoryId,position,createdAt',
                bookmarkCategories: 'id,workspaceId,position,createdAt',
                settings: 'key,updatedAt',
                weatherCache: 'id,fetchedAt',
                searchHistory: 'id,usedAt',
            })
            .upgrade(async transaction => {
                const notesTable = transaction.table('notes');

                const legacyNotes = (await notesTable.toArray() as LegacyNoteRecord[])
                    .sort((firstNote, secondNote) => {
                        if (firstNote.workspaceId !== secondNote.workspaceId) {
                            return firstNote.workspaceId.localeCompare(secondNote.workspaceId);
                        }

                        return firstNote.updatedAt - secondNote.updatedAt;
                    });

                const positionsByWorkspaceId = new Map<string, number>();

                for (const legacyNote of legacyNotes) {
                    const nextPosition = positionsByWorkspaceId.get(legacyNote.workspaceId) ?? 0;

                    positionsByWorkspaceId.set(legacyNote.workspaceId, nextPosition + 1);

                    await notesTable.update(legacyNote.id, {
                        title: legacyNote.title ?? '',
                        createdAt: legacyNote.createdAt ?? legacyNote.updatedAt,
                        position: legacyNote.position ?? nextPosition,
                    });
                }
            });
    }
}

export const db = new DashboardDatabase();
