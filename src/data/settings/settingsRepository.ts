import {db} from '@/db';
import {createId} from '@/lib';
import {isValidSearchUrlTemplate} from '@/search';
import {prepareBackgroundImageDataUrl} from './lib/backgroundImage';
import {DEFAULT_SETTINGS, mergeSettings} from './lib/defaultSettings';
import type {
    AppLocale,
    AppSettings,
    CustomSearchEngine,
    CustomTextColors,
    DateFormatPreset,
    TextColorKey,
    ThemeMode,
    TimeFormat,
} from '@/db';

export async function patchSettings(patch: Partial<AppSettings>) {
    const currentSettings = mergeSettings(await db.settings.get('app'));

    const nextSettings: AppSettings = {
        ...currentSettings,
        ...patch,
        updatedAt: Date.now(),
    };

    await db.settings.put(nextSettings);

    return nextSettings;
}

export async function setTheme(theme: ThemeMode) {
    return patchSettings({theme});
}

export async function setAccentColor(accentColor: string | null) {
    return patchSettings({accentColor});
}

export async function setActiveSearchEngineId(activeSearchEngineId: string) {
    return patchSettings({activeSearchEngineId});
}

export async function setSearchOpenInNewTab(searchOpenInNewTab: boolean) {
    return patchSettings({searchOpenInNewTab});
}

export async function setOnlineSearchSuggestionsEnabled(onlineSearchSuggestionsEnabled: boolean) {
    return patchSettings({onlineSearchSuggestionsEnabled});
}

export async function setSearchHistoryEnabled(searchHistoryEnabled: boolean) {
    return patchSettings({searchHistoryEnabled});
}

export async function setBookmarkFaviconsEnabled(bookmarkFaviconsEnabled: boolean) {
    return patchSettings({bookmarkFaviconsEnabled});
}

export async function setBackupReminderEnabled(backupReminderEnabled: boolean) {
    return patchSettings({backupReminderEnabled});
}

export async function setBackupReminderIntervalDays(backupReminderIntervalDays: number) {
    return patchSettings({
        backupReminderIntervalDays: Math.min(365, Math.max(1, Math.round(backupReminderIntervalDays))),
    });
}

export async function setLastBackupExportedAt(lastBackupExportedAt: number | null) {
    return patchSettings({lastBackupExportedAt});
}

export async function setTimeFormat(timeFormat: TimeFormat) {
    return patchSettings({timeFormat});
}

export async function setTimezone(timezone: string) {
    return patchSettings({timezone});
}

export async function setLocale(locale: AppLocale) {
    return patchSettings({locale});
}

export async function setDateFormat(dateFormat: DateFormatPreset) {
    return patchSettings({dateFormat});
}

export async function setTabTitle(tabTitle: string) {
    return patchSettings({tabTitle: tabTitle.trim() || DEFAULT_SETTINGS.tabTitle});
}

export async function setWeatherProvider(weatherProvider: AppSettings['weatherProvider']) {
    const settings = await patchSettings({weatherProvider});

    await db.weatherCache.delete('current');
    return settings;
}

export async function setWeatherApiKey(weatherApiKey: string | null) {
    const normalizedWeatherApiKey = weatherApiKey?.trim() ? weatherApiKey.trim() : null;
    const settings = await patchSettings({weatherApiKey: normalizedWeatherApiKey});

    await db.weatherCache.delete('current');
    return settings;
}

export async function setBackgroundImageFromFile(file: File) {
    const customBackgroundImage = await prepareBackgroundImageDataUrl(file);

    return patchSettings({customBackgroundImage});
}

export async function clearBackgroundImage() {
    return patchSettings({customBackgroundImage: null});
}

export async function setBackgroundScrimOpacity(backgroundScrimOpacity: number) {
    return patchSettings({
        backgroundScrimOpacity: Math.min(100, Math.max(0, Math.round(backgroundScrimOpacity))),
    });
}

export async function setTextColor(key: TextColorKey, value: string | null) {
    const currentSettings = mergeSettings(await db.settings.get('app'));

    const base: CustomTextColors = currentSettings.customTextColors ?? {
        text: null,
        textSoft: null,
        textMuted: null,
    };

    const nextColors: CustomTextColors = {...base, [key]: value};
    const hasAnyCustom = nextColors.text || nextColors.textSoft || nextColors.textMuted;

    return patchSettings({
        customTextColors: hasAnyCustom ? nextColors : null,
    });
}

export async function resetTextColors() {
    return patchSettings({customTextColors: null});
}

export async function addCustomSearchEngine(payload: { name: string; urlTemplate: string }) {
    const name = payload.name.trim();
    const urlTemplate = payload.urlTemplate.trim();

    if (!name || !isValidSearchUrlTemplate(urlTemplate)) {return null;}

    const currentSettings = mergeSettings(await db.settings.get('app'));

    const engine: CustomSearchEngine = {
        id: createId(),
        name,
        urlTemplate,
    };

    return patchSettings({
        customSearchEngines: [...currentSettings.customSearchEngines, engine],
        activeSearchEngineId: engine.id,
    });
}

export async function removeCustomSearchEngine(engineId: string) {
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const customSearchEngines = currentSettings.customSearchEngines.filter(engine => engine.id !== engineId);

    const activeSearchEngineId =
    currentSettings.activeSearchEngineId === engineId ? 'duckduckgo' : currentSettings.activeSearchEngineId;

    return patchSettings({customSearchEngines, activeSearchEngineId});
}
