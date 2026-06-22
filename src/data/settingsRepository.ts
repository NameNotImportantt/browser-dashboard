import {
    createId,
    DEFAULT_SETTINGS,
    isValidSearchUrlTemplate,
    mergeSettings,
    prepareBackgroundImageDataUrl,
} from '@/app';
import {db} from '@/db';
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

    await db.settings.put({
        ...currentSettings,
        ...patch,
        updatedAt: Date.now(),
    });
}

export async function setTheme(theme: ThemeMode) {
    await patchSettings({theme});
}

export async function setActiveSearchEngineId(activeSearchEngineId: string) {
    await patchSettings({activeSearchEngineId});
}

export async function setTimeFormat(timeFormat: TimeFormat) {
    await patchSettings({timeFormat});
}

export async function setTimezone(timezone: string) {
    await patchSettings({timezone});
}

export async function setLocale(locale: AppLocale) {
    await patchSettings({locale});
}

export async function setDateFormat(dateFormat: DateFormatPreset) {
    await patchSettings({dateFormat});
}

export async function setTabTitle(tabTitle: string) {
    await patchSettings({tabTitle: tabTitle.trim() || DEFAULT_SETTINGS.tabTitle});
}

export async function setBackgroundImageFromFile(file: File) {
    const customBackgroundImage = await prepareBackgroundImageDataUrl(file);

    await patchSettings({customBackgroundImage});
}

export async function clearBackgroundImage() {
    await patchSettings({customBackgroundImage: null});
}

export async function setBackgroundScrimOpacity(backgroundScrimOpacity: number) {
    await patchSettings({
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

    await patchSettings({
        customTextColors: hasAnyCustom ? nextColors : null,
    });
}

export async function resetTextColors() {
    await patchSettings({customTextColors: null});
}

export async function addCustomSearchEngine(payload: { name: string; urlTemplate: string }) {
    const name = payload.name.trim();
    const urlTemplate = payload.urlTemplate.trim();

    if (!name || !isValidSearchUrlTemplate(urlTemplate)) {return;}

    const currentSettings = mergeSettings(await db.settings.get('app'));

    const engine: CustomSearchEngine = {
        id: createId(),
        name,
        urlTemplate,
    };

    await patchSettings({
        customSearchEngines: [...currentSettings.customSearchEngines, engine],
        activeSearchEngineId: engine.id,
    });
}

export async function removeCustomSearchEngine(engineId: string) {
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const customSearchEngines = currentSettings.customSearchEngines.filter(engine => engine.id !== engineId);

    const activeSearchEngineId =
    currentSettings.activeSearchEngineId === engineId ? 'duckduckgo' : currentSettings.activeSearchEngineId;

    await patchSettings({customSearchEngines, activeSearchEngineId});
}
