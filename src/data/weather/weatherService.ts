import {mergeSettings} from '@/data/settings';
import {db} from '@/db';
import {patchSettings} from '../settings/settingsRepository';
import {WEATHER_CACHE_TTL_MS, WEATHER_FETCH_TIMEOUT_MS} from './constants';
import {geocodeCity} from './lib/geocodeCity';
import type {AppSettings, WeatherCache} from '@/db';

export async function refreshWeather(force = false): Promise<WeatherCache | null> {
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const cache = await db.weatherCache.get('current');
    const cacheIsFresh = cache ? Date.now() - cache.fetchedAt < WEATHER_CACHE_TTL_MS : false;

    if (!force && cacheIsFresh) {
        return cache ?? null;
    }

    const location = currentSettings.weatherLocation;

    if (!location) {
        await db.weatherCache.delete('current');
        return null;
    }

    const query = new URLSearchParams({
        latitude: String(location.lat),
        longitude: String(location.lon),
        current: 'temperature_2m,weather_code',
    });

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), WEATHER_FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`, {
            signal: abortController.signal,
        });

        if (!response.ok) {
            throw new Error('Не удалось получить данные погоды');
        }

        const data = (await response.json()) as {
            current?: {
                temperature_2m?: number;
                weather_code?: number;
            };
        };

        const temperatureC = data.current?.temperature_2m;
        const weatherCode = data.current?.weather_code;

        if (typeof temperatureC !== 'number' || typeof weatherCode !== 'number') {
            throw new Error('Сервис погоды вернул неполные данные');
        }

        const latestSettings = mergeSettings(await db.settings.get('app'));
        const latestLocation = latestSettings.weatherLocation;

        if (
            !latestLocation ||
            latestLocation.lat !== location.lat ||
            latestLocation.lon !== location.lon ||
            latestLocation.label !== location.label
        ) {
            return null;
        }

        const nextWeatherCache: WeatherCache = {
            id: 'current',
            locationLabel: location.label,
            temperatureC,
            weatherCode,
            fetchedAt: Date.now(),
        };

        await db.weatherCache.put(nextWeatherCache);

        return nextWeatherCache;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Сервис погоды не ответил вовремя');
        }

        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}

export async function getWeatherCache() {
    return (await db.weatherCache.get('current')) ?? null;
}

export async function setWeatherCity(city: string): Promise<AppSettings> {
    const trimmed = city.trim();

    if (!trimmed) {
        const settings = await patchSettings({weatherLocation: null});

        await db.weatherCache.delete('current');
        return settings;
    }

    const location = await geocodeCity(trimmed);

    return patchSettings({weatherLocation: location});
}
