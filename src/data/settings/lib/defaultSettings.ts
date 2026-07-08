import {normalizeWeatherLocation} from '@/data/weather/lib/weatherCache';
import {normalizeWeatherProvider} from '@/data/weather/lib/weatherProvider';
import {WeatherProvider, type AppSettings} from '@/db';
import {BUILTIN_SEARCH_ENGINES, getSearchEngineOptions} from '@/search';

export const DEFAULT_TAB_TITLE = 'Personal Dashboard';

export const DEFAULT_BACKGROUND_SCRIM_OPACITY = 65;

function clampBackgroundScrimOpacity(value: number) {
    return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeBackupReminderIntervalDays(value: number) {
    return Math.min(365, Math.max(1, Math.round(value)));
}

export const DEFAULT_SETTINGS: AppSettings = {
    key: 'app',
    theme: 'dark',
    accentColor: null,
    activeSearchEngineId: 'duckduckgo',
    hiddenBuiltinSearchEngineIds: [],
    customSearchEngines: [],
    searchOpenInNewTab: true,
    onlineSearchSuggestionsEnabled: true,
    searchHistoryEnabled: true,
    bookmarkFaviconsEnabled: true,
    backupReminderEnabled: true,
    backupReminderIntervalDays: 7,
    lastBackupExportedAt: null,
    timeFormat: '24h',
    timezone: 'auto',
    locale: 'ru',
    dateFormat: 'dd.MM.yyyy',
    tabTitle: DEFAULT_TAB_TITLE,
    lastWorkspaceId: null,
    weatherProvider: WeatherProvider.OpenMeteo,
    weatherApiKey: null,
    weatherLocation: null,
    customBackgroundImage: null,
    backgroundScrimOpacity: DEFAULT_BACKGROUND_SCRIM_OPACITY,
    customTextColors: null,
    updatedAt: Date.now(),
};

export function mergeSettings(raw?: Partial<AppSettings> | null): AppSettings {
    if (!raw) {
        return DEFAULT_SETTINGS;
    }

    const legacySearchEngine = (raw as { searchEngine?: string }).searchEngine;

    const hiddenBuiltinSearchEngineIds = Array.isArray(raw.hiddenBuiltinSearchEngineIds)
        ? raw.hiddenBuiltinSearchEngineIds.filter(searchEngineId =>
            BUILTIN_SEARCH_ENGINES.some(searchEngine => searchEngine.id === searchEngineId),
        )
        : DEFAULT_SETTINGS.hiddenBuiltinSearchEngineIds;

    const customSearchEngines = raw.customSearchEngines ?? DEFAULT_SETTINGS.customSearchEngines;
    const availableSearchEngines = getSearchEngineOptions(customSearchEngines, hiddenBuiltinSearchEngineIds);
    const requestedActiveSearchEngineId = raw.activeSearchEngineId ?? legacySearchEngine ?? DEFAULT_SETTINGS.activeSearchEngineId;

    const activeSearchEngineId = availableSearchEngines.some(searchEngine => searchEngine.id === requestedActiveSearchEngineId)
        ? requestedActiveSearchEngineId
        : (availableSearchEngines[0]?.id ?? '');

    return {
        ...DEFAULT_SETTINGS,
        ...raw,
        accentColor: raw.accentColor ?? DEFAULT_SETTINGS.accentColor,
        activeSearchEngineId,
        hiddenBuiltinSearchEngineIds,
        customSearchEngines,
        searchOpenInNewTab: raw.searchOpenInNewTab ?? DEFAULT_SETTINGS.searchOpenInNewTab,
        onlineSearchSuggestionsEnabled: raw.onlineSearchSuggestionsEnabled ?? DEFAULT_SETTINGS.onlineSearchSuggestionsEnabled,
        searchHistoryEnabled: raw.searchHistoryEnabled ?? DEFAULT_SETTINGS.searchHistoryEnabled,
        bookmarkFaviconsEnabled: raw.bookmarkFaviconsEnabled ?? DEFAULT_SETTINGS.bookmarkFaviconsEnabled,
        backupReminderEnabled: raw.backupReminderEnabled ?? DEFAULT_SETTINGS.backupReminderEnabled,
        backupReminderIntervalDays: normalizeBackupReminderIntervalDays(
            raw.backupReminderIntervalDays ?? DEFAULT_SETTINGS.backupReminderIntervalDays,
        ),
        lastBackupExportedAt: raw.lastBackupExportedAt ?? DEFAULT_SETTINGS.lastBackupExportedAt,
        timeFormat: raw.timeFormat ?? DEFAULT_SETTINGS.timeFormat,
        timezone: raw.timezone ?? DEFAULT_SETTINGS.timezone,
        locale: raw.locale ?? DEFAULT_SETTINGS.locale,
        dateFormat: raw.dateFormat ?? DEFAULT_SETTINGS.dateFormat,
        tabTitle: raw.tabTitle?.trim() || DEFAULT_TAB_TITLE,
        weatherProvider: normalizeWeatherProvider(raw.weatherProvider),
        weatherApiKey: raw.weatherApiKey?.trim() ? raw.weatherApiKey.trim() : null,
        weatherLocation: normalizeWeatherLocation(
            raw.weatherLocation,
            normalizeWeatherProvider(raw.weatherProvider),
        ),
        customBackgroundImage: raw.customBackgroundImage ?? DEFAULT_SETTINGS.customBackgroundImage,
        backgroundScrimOpacity: clampBackgroundScrimOpacity(
            raw.backgroundScrimOpacity ?? DEFAULT_SETTINGS.backgroundScrimOpacity,
        ),
        customTextColors: raw.customTextColors ?? DEFAULT_SETTINGS.customTextColors,
    };
}
