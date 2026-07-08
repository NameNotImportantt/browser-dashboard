import {WEATHER_FETCH_TIMEOUT_MS} from '../constants';
import {geocodeCity} from '../lib/geocodeCity';
import type {WeatherLocation} from '@/db';

export async function lookupOpenMeteoCity(city: string) {
    return geocodeCity(city);
}

export async function fetchOpenMeteoCurrentWeather(location: WeatherLocation) {
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

        return {
            temperatureC,
            weatherCode,
        };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Сервис погоды не ответил вовремя');
        }

        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}
