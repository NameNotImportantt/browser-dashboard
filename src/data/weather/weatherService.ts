import {mergeSettings} from '@/data/settings';
import {WeatherProvider, db, type AppSettings, type WeatherCache, type WeatherLocation} from '@/db';
import {patchSettings} from '../settings/settingsRepository';
import {WEATHER_CACHE_TTL_MS} from './constants';
import {isWeatherCacheCompatible, normalizeWeatherCache} from './lib/weatherCache';
import {lookupOpenMeteoCity, fetchOpenMeteoCurrentWeather} from './providers/openMeteo';
import {lookupWeatherApiCity, fetchWeatherApiCurrentWeather} from './providers/weatherApi';

function getWeatherApiKeyOrThrow(settings: AppSettings) {
    const weatherApiKey = settings.weatherApiKey?.trim();

    if (!weatherApiKey) {
        throw new Error('Введите API key для WeatherAPI.com');
    }

    return weatherApiKey;
}

async function lookupWeatherLocation(city: string, settings: AppSettings): Promise<WeatherLocation> {
    if (settings.weatherProvider === WeatherProvider.WeatherApi) {
        const weatherApiKey = getWeatherApiKeyOrThrow(settings);
        const location = await lookupWeatherApiCity(city, weatherApiKey);

        return {
            ...location,
            provider: WeatherProvider.WeatherApi,
        };
    }

    const location = await lookupOpenMeteoCity(city);

    return {
        ...location,
        provider: WeatherProvider.OpenMeteo,
    };
}

async function fetchCurrentWeather(settings: AppSettings, location: WeatherLocation) {
    if (settings.weatherProvider === WeatherProvider.WeatherApi) {
        const weatherApiKey = getWeatherApiKeyOrThrow(settings);

        return fetchWeatherApiCurrentWeather(location, weatherApiKey);
    }

    return fetchOpenMeteoCurrentWeather(location);
}

export async function refreshWeather(force = false): Promise<WeatherCache | null> {
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const cache = normalizeWeatherCache(await db.weatherCache.get('current'));
    const cacheIsFresh = cache ? Date.now() - cache.fetchedAt < WEATHER_CACHE_TTL_MS : false;

    if (!currentSettings.weatherLocation || currentSettings.weatherLocation.provider !== currentSettings.weatherProvider) {
        await db.weatherCache.delete('current');
        return null;
    }

    if (!force && cacheIsFresh && isWeatherCacheCompatible(cache, currentSettings)) {
        return cache ?? null;
    }

    const location = currentSettings.weatherLocation;

    if (!location) {
        await db.weatherCache.delete('current');
        return null;
    }

    try {
        const currentWeather = await fetchCurrentWeather(currentSettings, location);

        const latestSettings = mergeSettings(await db.settings.get('app'));
        const latestLocation = latestSettings.weatherLocation;

        if (
            !latestLocation ||
            latestSettings.weatherProvider !== currentSettings.weatherProvider ||
            latestLocation.provider !== currentSettings.weatherProvider ||
            latestLocation.lat !== location.lat ||
            latestLocation.lon !== location.lon ||
            latestLocation.label !== location.label
        ) {
            return null;
        }

        if (
            latestSettings.weatherProvider === WeatherProvider.WeatherApi &&
            latestSettings.weatherApiKey?.trim() !== currentSettings.weatherApiKey?.trim()
        ) {
            return null;
        }

        const nextWeatherCache: WeatherCache = {
            id: 'current',
            provider: currentSettings.weatherProvider,
            locationLabel: location.label,
            temperatureC: currentWeather.temperatureC,
            weatherCode: currentWeather.weatherCode,
            fetchedAt: Date.now(),
        };

        await db.weatherCache.put(nextWeatherCache);

        return nextWeatherCache;
    } catch (error) {
        if (currentSettings.weatherProvider === WeatherProvider.WeatherApi && !currentSettings.weatherApiKey?.trim()) {
            await db.weatherCache.delete('current');
        }

        throw error;
    }
}

export async function getWeatherCache() {
    return normalizeWeatherCache(await db.weatherCache.get('current'));
}

export async function setWeatherCity(city: string): Promise<AppSettings> {
    const trimmed = city.trim();

    if (!trimmed) {
        const settings = await patchSettings({weatherLocation: null});

        await db.weatherCache.delete('current');
        return settings;
    }

    const currentSettings = mergeSettings(await db.settings.get('app'));
    const location = await lookupWeatherLocation(trimmed, currentSettings);

    await db.weatherCache.delete('current');

    return patchSettings({weatherLocation: location});
}
