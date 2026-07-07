import type {Bookmark} from './bookmark';
import type {BookmarkCategory} from './bookmarkCategory';
import type {AppSettings} from './settings';
import type {TodoItem} from './todo';
import type {WeatherCache} from './weather';
import type {Workspace} from './workspace';

export interface HomeBootstrapSnapshot {
    workspaces: Workspace[];
    todos: TodoItem[];
    bookmarks: Bookmark[];
    bookmarkCategories: BookmarkCategory[];
    settings: AppSettings;
    weatherCache: WeatherCache | null;
}

export interface HomeBootstrapCacheRecord {
    id: string;
    schemaVersion: number;
    cachedAt: number;
    activeWorkspaceId: string | null;
    snapshot: HomeBootstrapSnapshot;
}
