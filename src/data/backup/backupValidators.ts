import type {DashboardBackupData, DashboardBackupEnvelope} from './backupSchema';
import type {AppSettings, Bookmark, BookmarkCategory, Habit, Note, SearchHistoryEntry, TodoItem, WeatherCache, Workspace} from '@/db';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function isNullableString(value: unknown): value is string | null {
    return value === null || isString(value);
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(isString);
}

function isWorkspace(value: unknown): value is Workspace {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.name) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isTodoPriority(value: unknown): value is TodoItem['priority'] {
    return value === 'low' || value === 'medium' || value === 'high';
}

function isTodoItem(value: unknown): value is TodoItem {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.title) &&
        isBoolean(value.completed) &&
        isTodoPriority(value.priority) &&
        (value.dueDate === null || isString(value.dueDate)) &&
        isNumber(value.position) &&
        isNumber(value.createdAt) &&
        isNumber(value.updatedAt);
}

function isHabit(value: unknown): value is Habit {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.title) &&
        isStringArray(value.completionDates) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isBookmark(value: unknown): value is Bookmark {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isNullableString(value.categoryId) &&
        isString(value.title) &&
        isString(value.url) &&
        isNullableString(value.faviconUrl) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isBookmarkCategory(value: unknown): value is BookmarkCategory {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.name) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isNote(value: unknown): value is Note {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.text) &&
        isNumber(value.updatedAt);
}

function isWeatherLocation(value: unknown): value is NonNullable<AppSettings['weatherLocation']> {
    return isRecord(value) &&
        isNumber(value.lat) &&
        isNumber(value.lon) &&
        isString(value.label);
}

function isCustomSearchEngine(value: unknown): value is AppSettings['customSearchEngines'][number] {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.name) &&
        isString(value.urlTemplate);
}

function isCustomTextColors(value: unknown): value is NonNullable<AppSettings['customTextColors']> {
    return isRecord(value) &&
        isNullableString(value.text) &&
        isNullableString(value.textSoft) &&
        isNullableString(value.textMuted);
}

function isAppSettings(value: unknown): value is AppSettings {
    return isRecord(value) &&
        value.key === 'app' &&
        (value.theme === 'light' || value.theme === 'dark') &&
        isString(value.activeSearchEngineId) &&
        Array.isArray(value.customSearchEngines) &&
        value.customSearchEngines.every(isCustomSearchEngine) &&
        isBoolean(value.onlineSearchSuggestionsEnabled) &&
        isBoolean(value.searchHistoryEnabled) &&
        isBoolean(value.bookmarkFaviconsEnabled) &&
        isBoolean(value.backupReminderEnabled) &&
        isNumber(value.backupReminderIntervalDays) &&
        (value.lastBackupExportedAt === null || isNumber(value.lastBackupExportedAt)) &&
        (value.timeFormat === '12h' || value.timeFormat === '24h') &&
        isString(value.timezone) &&
        (value.locale === 'ru' || value.locale === 'en') &&
        (value.dateFormat === 'dd.MM.yyyy' || value.dateFormat === 'MM/dd/yyyy' || value.dateFormat === 'yyyy-MM-dd') &&
        isString(value.tabTitle) &&
        (value.lastWorkspaceId === null || isString(value.lastWorkspaceId)) &&
        (value.weatherLocation === null || isWeatherLocation(value.weatherLocation)) &&
        (value.customBackgroundImage === null || isString(value.customBackgroundImage)) &&
        isNumber(value.backgroundScrimOpacity) &&
        (value.customTextColors === null || isCustomTextColors(value.customTextColors)) &&
        isNumber(value.updatedAt);
}

function isWeatherCache(value: unknown): value is WeatherCache {
    return isRecord(value) &&
        value.id === 'current' &&
        isString(value.locationLabel) &&
        isNumber(value.temperatureC) &&
        isNumber(value.weatherCode) &&
        isNumber(value.fetchedAt);
}

function isSearchHistoryEntry(value: unknown): value is SearchHistoryEntry {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.query) &&
        isNumber(value.usedAt);
}

function isDashboardBackupData(value: unknown): value is DashboardBackupData {
    return isRecord(value) &&
        Array.isArray(value.workspaces) &&
        value.workspaces.every(isWorkspace) &&
        Array.isArray(value.todos) &&
        value.todos.every(isTodoItem) &&
        Array.isArray(value.habits) &&
        value.habits.every(isHabit) &&
        Array.isArray(value.bookmarks) &&
        value.bookmarks.every(isBookmark) &&
        Array.isArray(value.bookmarkCategories) &&
        value.bookmarkCategories.every(isBookmarkCategory) &&
        Array.isArray(value.notes) &&
        value.notes.every(isNote) &&
        isAppSettings(value.settings) &&
        (value.weatherCache === null || isWeatherCache(value.weatherCache)) &&
        Array.isArray(value.searchHistory) &&
        value.searchHistory.every(isSearchHistoryEntry);
}

export function isDashboardBackupEnvelope(value: unknown): value is DashboardBackupEnvelope {
    return isRecord(value) &&
        isNumber(value.schemaVersion) &&
        isNumber(value.exportedAt) &&
        isString(value.appName) &&
        isDashboardBackupData(value.data);
}
