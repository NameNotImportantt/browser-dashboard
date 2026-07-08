import {WeatherProvider, type AppSettings, type WeatherCache, type WeatherLocation} from '@/db';
import {isWeatherProvider, normalizeWeatherProvider} from './weatherProvider';

interface WeatherCacheRecordShape {
    id?: string;
    provider?: string;
    locationLabel?: string;
    temperatureC?: number;
    weatherCode?: number;
    fetchedAt?: number;
}

interface WeatherLocationShape {
    lat?: number;
    lon?: number;
    label?: string;
    provider?: string;
}

export function normalizeWeatherLocation(
    rawLocation: WeatherLocationShape | WeatherLocation | null | undefined,
    fallbackProvider: WeatherProvider,
): WeatherLocation | null {
    if (!rawLocation) {
        return null;
    }

    if (
        typeof rawLocation.lat !== 'number' ||
        typeof rawLocation.lon !== 'number' ||
        typeof rawLocation.label !== 'string'
    ) {
        return null;
    }

    return {
        lat: rawLocation.lat,
        lon: rawLocation.lon,
        label: rawLocation.label,
        provider: isWeatherProvider(rawLocation.provider) ? rawLocation.provider : fallbackProvider,
    };
}

export function normalizeWeatherCache(rawCache: WeatherCacheRecordShape | WeatherCache | null | undefined): WeatherCache | null {
    if (!rawCache) {
        return null;
    }

    if (
        rawCache.id !== 'current' ||
        typeof rawCache.locationLabel !== 'string' ||
        typeof rawCache.temperatureC !== 'number' ||
        typeof rawCache.weatherCode !== 'number' ||
        typeof rawCache.fetchedAt !== 'number'
    ) {
        return null;
    }

    return {
        id: 'current',
        provider: normalizeWeatherProvider(rawCache.provider),
        locationLabel: rawCache.locationLabel,
        temperatureC: rawCache.temperatureC,
        weatherCode: rawCache.weatherCode,
        fetchedAt: rawCache.fetchedAt,
    };
}

export function isWeatherCacheCompatible(cache: WeatherCache | null, settings: AppSettings) {
    if (!cache || !settings.weatherLocation) {
        return false;
    }

    if (settings.weatherLocation.provider !== settings.weatherProvider) {
        return false;
    }

    if (cache.provider !== settings.weatherProvider) {
        return false;
    }

    if (cache.locationLabel !== settings.weatherLocation.label) {
        return false;
    }

    if (settings.weatherProvider === WeatherProvider.WeatherApi && !settings.weatherApiKey?.trim()) {
        return false;
    }

    return true;
}
