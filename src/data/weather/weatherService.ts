import {mergeSettings} from '@/data/settings';
import {db} from '@/db';
import {patchSettings} from '../settings/settingsRepository';
import {WEATHER_CACHE_TTL_MS} from './constants';
import {geocodeCity} from './lib/geocodeCity';

export async function refreshWeather(force = false) {
    const currentSettings = mergeSettings(await db.settings.get('app'));
    const cache = await db.weatherCache.get('current');
    const cacheIsFresh = cache ? Date.now() - cache.fetchedAt < WEATHER_CACHE_TTL_MS : false;

    if (!force && cacheIsFresh) {
        return;
    }

    const location = currentSettings.weatherLocation;

    if (!location) {
        await db.weatherCache.delete('current');
        return;
    }

    const query = new URLSearchParams({
        latitude: String(location.lat),
        longitude: String(location.lon),
        current: 'temperature_2m,weather_code',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`);

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

    await db.weatherCache.put({
        id: 'current',
        locationLabel: location.label,
        temperatureC,
        weatherCode,
        fetchedAt: Date.now(),
    });
}

export async function setWeatherCity(city: string) {
    const trimmed = city.trim();

    if (!trimmed) {
        await patchSettings({weatherLocation: null});
        await refreshWeather(true);
        return;
    }

    const location = await geocodeCity(trimmed);

    await patchSettings({weatherLocation: location});
    await refreshWeather(true);
}
