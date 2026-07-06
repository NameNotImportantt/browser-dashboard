import Dexie, {type Table} from 'dexie';
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
} from './types';

const DASHBOARD_DATABASE_NAME = 'browser-home-page-db';

const DASHBOARD_DATABASE_SCHEMA = {
    workspaces: 'id,position,createdAt',
    todos: 'id,workspaceId,completed,priority,dueDate,position,updatedAt',
    notes: 'id,workspaceId,position,updatedAt,createdAt',
    habits: 'id,workspaceId,position,createdAt',
    bookmarks: 'id,workspaceId,categoryId,position,createdAt',
    bookmarkCategories: 'id,workspaceId,position,createdAt',
    settings: 'key,updatedAt',
    weatherCache: 'id,fetchedAt',
    searchHistory: 'id,usedAt,normalizedQuery',
};

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
        super(DASHBOARD_DATABASE_NAME);

        this.version(10).stores(DASHBOARD_DATABASE_SCHEMA);
        this.version(11)
            .stores(DASHBOARD_DATABASE_SCHEMA)
            .upgrade(async transaction => {
                await transaction.table('searchHistory').toCollection().modify(searchHistoryEntry => {
                    searchHistoryEntry.normalizedQuery = searchHistoryEntry.query.trim().toLowerCase();
                });
            });
    }
}

export const db = new DashboardDatabase();
