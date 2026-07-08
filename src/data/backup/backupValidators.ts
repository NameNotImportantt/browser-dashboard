import type {BackupJsonObject, BackupJsonValue} from './backupJsonValue';
import type {DashboardBackupData, DashboardBackupEnvelope, DashboardBackupNote} from './backupSchema';
import type {AppSettings, Bookmark, BookmarkCategory, Habit, SearchHistoryEntry, TodoItem, WeatherCache, Workspace} from '@/db';

type BackupInspectableValue = BackupJsonValue | object | undefined;

function isRecord(value: BackupInspectableValue): value is BackupJsonObject {
    return typeof value === 'object' && value !== null;
}

function isString(value: BackupInspectableValue): value is string {
    return typeof value === 'string';
}

function isNumber(value: BackupInspectableValue): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function isNullableString(value: BackupInspectableValue): value is string | null {
    return value === null || isString(value);
}

function isBoolean(value: BackupInspectableValue): value is boolean {
    return typeof value === 'boolean';
}

function isStringArray(value: BackupInspectableValue): value is string[] {
    return Array.isArray(value) && value.every(isString);
}

function isWorkspace(value: BackupInspectableValue): value is Workspace {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.name) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isTodoPriority(value: BackupInspectableValue): value is TodoItem['priority'] {
    return value === 'low' || value === 'medium' || value === 'high';
}

function isTodoItem(value: BackupInspectableValue): value is TodoItem {
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

function isHabit(value: BackupInspectableValue): value is Habit {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.title) &&
        isStringArray(value.completionDates) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isBookmark(value: BackupInspectableValue): value is Bookmark {
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

function isBookmarkCategory(value: BackupInspectableValue): value is BookmarkCategory {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        isString(value.name) &&
        isNumber(value.position) &&
        isNumber(value.createdAt);
}

function isNote(value: BackupInspectableValue): value is DashboardBackupNote {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.workspaceId) &&
        (value.title === undefined || isString(value.title)) &&
        isString(value.text) &&
        isNumber(value.updatedAt) &&
        (value.createdAt === undefined || isNumber(value.createdAt)) &&
        (value.position === undefined || isNumber(value.position));
}

function isWeatherLocation(value: BackupInspectableValue): value is NonNullable<AppSettings['weatherLocation']> {
    return isRecord(value) &&
        isNumber(value.lat) &&
        isNumber(value.lon) &&
        isString(value.label);
}

function isCustomSearchEngine(value: BackupInspectableValue): value is AppSettings['customSearchEngines'][number] {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.name) &&
        isString(value.urlTemplate);
}

function isCustomTextColors(value: BackupInspectableValue): value is NonNullable<AppSettings['customTextColors']> {
    return isRecord(value) &&
        isNullableString(value.text) &&
        isNullableString(value.textSoft) &&
        isNullableString(value.textMuted);
}

function isAppSettings(value: BackupInspectableValue): value is AppSettings {
    return isRecord(value) &&
        value.key === 'app' &&
        (value.theme === 'light' || value.theme === 'dark') &&
        (value.accentColor === undefined || isNullableString(value.accentColor)) &&
        isString(value.activeSearchEngineId) &&
        Array.isArray(value.customSearchEngines) &&
        value.customSearchEngines.every(isCustomSearchEngine) &&
        (value.searchOpenInNewTab === undefined || isBoolean(value.searchOpenInNewTab)) &&
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

function isWeatherCache(value: BackupInspectableValue): value is WeatherCache {
    return isRecord(value) &&
        value.id === 'current' &&
        isString(value.locationLabel) &&
        isNumber(value.temperatureC) &&
        isNumber(value.weatherCode) &&
        isNumber(value.fetchedAt);
}

function isSearchHistoryEntry(value: BackupInspectableValue): value is SearchHistoryEntry {
    return isRecord(value) &&
        isString(value.id) &&
        isString(value.query) &&
        (value.normalizedQuery === undefined || isString(value.normalizedQuery)) &&
        isNumber(value.usedAt);
}

function isDashboardBackupData(value: BackupInspectableValue): value is DashboardBackupData {
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

export function isDashboardBackupEnvelope(value: BackupInspectableValue): value is DashboardBackupEnvelope {
    return isRecord(value) &&
        isNumber(value.schemaVersion) &&
        isNumber(value.exportedAt) &&
        isString(value.appName) &&
        isDashboardBackupData(value.data);
}
