import type {AppLocale, AppSettings, DateFormatPreset, TimeFormat} from '@/db';

export const DEFAULT_TAB_TITLE = 'Personal Dashboard';

export const DEFAULT_BACKGROUND_SCRIM_OPACITY = 65;

function clampBackgroundScrimOpacity(value: number) {
    return Math.min(100, Math.max(0, Math.round(value)));
}

export const DEFAULT_SETTINGS: AppSettings = {
    key: 'app',
    theme: 'dark',
    activeSearchEngineId: 'duckduckgo',
    customSearchEngines: [],
    searchHistoryEnabled: true,
    timeFormat: '24h',
    timezone: 'auto',
    locale: 'ru',
    dateFormat: 'dd.MM.yyyy',
    tabTitle: DEFAULT_TAB_TITLE,
    lastWorkspaceId: null,
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

    return {
        ...DEFAULT_SETTINGS,
        ...raw,
        activeSearchEngineId: raw.activeSearchEngineId ?? legacySearchEngine ?? DEFAULT_SETTINGS.activeSearchEngineId,
        customSearchEngines: raw.customSearchEngines ?? DEFAULT_SETTINGS.customSearchEngines,
        searchHistoryEnabled: raw.searchHistoryEnabled ?? DEFAULT_SETTINGS.searchHistoryEnabled,
        timeFormat: raw.timeFormat ?? DEFAULT_SETTINGS.timeFormat,
        timezone: raw.timezone ?? DEFAULT_SETTINGS.timezone,
        locale: raw.locale ?? DEFAULT_SETTINGS.locale,
        dateFormat: raw.dateFormat ?? DEFAULT_SETTINGS.dateFormat,
        tabTitle: raw.tabTitle?.trim() || DEFAULT_TAB_TITLE,
        customBackgroundImage: raw.customBackgroundImage ?? DEFAULT_SETTINGS.customBackgroundImage,
        backgroundScrimOpacity: clampBackgroundScrimOpacity(
            raw.backgroundScrimOpacity ?? DEFAULT_SETTINGS.backgroundScrimOpacity,
        ),
        customTextColors: raw.customTextColors ?? DEFAULT_SETTINGS.customTextColors,
    };
}

export function resolveTimezone(timezone: string) {
    if (timezone === 'auto') {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    return timezone;
}

export function formatClockLabels(
    now: Date,
    options: {
    locale: AppLocale;
    timeFormat: TimeFormat;
    dateFormat: DateFormatPreset;
    timezone: string;
  },
) {
    const intlLocale = options.locale === 'en' ? 'en-US' : 'ru-RU';
    const timeZone = resolveTimezone(options.timezone);

    const timeLabel = new Intl.DateTimeFormat(intlLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: options.timeFormat === '12h',
        timeZone,
    }).format(now);

    const dateLabel = formatDateByPreset(now, options.dateFormat, intlLocale, timeZone);

    return {timeLabel, dateLabel};
}

function formatDateByPreset(now: Date, preset: DateFormatPreset, locale: string, timeZone: string) {
    const parts = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone,
    }).formatToParts(now);

    const day = parts.find(part => part.type === 'day')?.value ?? '01';
    const month = parts.find(part => part.type === 'month')?.value ?? '01';
    const year = parts.find(part => part.type === 'year')?.value ?? '1970';

    if (preset === 'MM/dd/yyyy') {
        return `${month}/${day}/${year}`;
    }

    if (preset === 'yyyy-MM-dd') {
        return `${year}-${month}-${day}`;
    }

    return `${day}.${month}.${year}`;
}

export async function geocodeCity(city: string) {
    const query = new URLSearchParams({
        name: city.trim(),
        count: '1',
        language: 'ru',
        format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${query.toString()}`);

    if (!response.ok) {
        throw new Error('Не удалось найти город');
    }

    const data = (await response.json()) as {
    results?: Array<{
      name: string;
      latitude: number;
      longitude: number;
      country?: string;
      admin1?: string;
    }>;
  };

    const result = data.results?.[0];

    if (!result) {
        throw new Error('Город не найден');
    }

    const labelParts = [result.name, result.admin1, result.country].filter(Boolean);

    return {
        lat: Number(result.latitude.toFixed(4)),
        lon: Number(result.longitude.toFixed(4)),
        label: labelParts.join(', '),
    };
}
